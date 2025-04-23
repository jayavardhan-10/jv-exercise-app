import React, { useState } from 'react';
import { WorkoutProvider, useWorkout } from './context/WorkoutContext';
import WorkoutPlanDashboard from './components/WorkoutPlanDashboard';
import PreWorkoutCountdown from './components/PreWorkoutCountdown';
import ExerciseExecutionScreen from './components/ExerciseExecutionScreen';
import RestScreen from './components/RestScreen';
import WorkoutComplete from './components/WorkoutComplete';
import CreateWorkout from './components/CreateWorkout';
import './App.css';

const AppContent = () => {
  const {
    currentWorkout,
    currentExerciseIndex,
    isResting,
    isWorkoutComplete,
    startWorkout,
    completeExercise,
    completeRest,
    skipExercise,
  } = useWorkout();

  const [showCountdown, setShowCountdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(() => {
    const path = window.location.pathname;
    return path === '/create-workout' ? 'create' : 'dashboard';
  });

  const handleStartWorkout = (workoutId) => {
    startWorkout(workoutId);
    setShowCountdown(true);
  };

  const handleCountdownComplete = () => {
    setShowCountdown(false);
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.history.pushState(null, '', page === 'create' ? '/create-workout' : '/');
  };

  if (showCountdown && currentWorkout) {
    return (
      <PreWorkoutCountdown
        firstExercise={currentWorkout.exercises[0].name}
        onCountdownComplete={handleCountdownComplete}
      />
    );
  }

  if (isWorkoutComplete) {
    return <WorkoutComplete />;
  }

  if (currentWorkout) {
    if (isResting) {
      return (
        <RestScreen
          restDuration={currentWorkout.restDuration}
          nextExercise={currentWorkout.exercises[currentExerciseIndex + 1]}
          onComplete={completeRest}
          onAddTime={() => {
            // Implement add time functionality
          }}
        />
      );
    }

    return (
      <ExerciseExecutionScreen
        exercise={currentWorkout.exercises[currentExerciseIndex]}
        currentExerciseIndex={currentExerciseIndex}
        totalExercises={currentWorkout.exercises.length}
        onComplete={completeExercise}
        onSkip={skipExercise}
        onPrevious={() => {
          // Implement previous exercise functionality
        }}
      />
    );
  }

  if (currentPage === 'create') {
    return <CreateWorkout onNavigate={handleNavigate} />;
  }

  return <WorkoutPlanDashboard onStartWorkout={handleStartWorkout} onNavigate={handleNavigate} />;
};

function App() {
  return (
    <WorkoutProvider>
      <AppContent />
    </WorkoutProvider>
  );
}

export default App;
