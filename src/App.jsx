import React, { useState } from 'react';
import { WorkoutProvider, useWorkout } from './context/WorkoutContext';
import WorkoutPlanDashboard from './components/WorkoutPlanDashboard';
import PreWorkoutCountdown from './components/PreWorkoutCountdown';
import ExerciseExecutionScreen from './components/ExerciseExecutionScreen';
import RestScreen from './components/RestScreen';
import WorkoutComplete from './components/WorkoutComplete';
import CreateWorkout from './components/CreateWorkout';
import EditWorkout from './components/EditWorkout';
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
    workouts,
  } = useWorkout();

  const [showCountdown, setShowCountdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(() => {
    const path = window.location.pathname;
    return path === '/create-workout' ? 'create' : 'dashboard';
  });
  const [editingWorkout, setEditingWorkout] = useState(null);

  const handleStartWorkout = (workoutId) => {
    startWorkout(workoutId);
    setShowCountdown(true);
  };

  const handleCountdownComplete = () => {
    setShowCountdown(false);
  };

  const handleNavigate = (page, workout = null) => {
    setCurrentPage(page);
    if (page === 'edit' && workout) {
      setEditingWorkout(workout);
    }
    window.history.pushState(null, '', page === 'create' ? '/create-workout' : 
                                    page === 'edit' ? '/edit-workout' : '/');
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

  if (currentPage === 'edit' && editingWorkout) {
    return <EditWorkout workout={editingWorkout} onNavigate={handleNavigate} />;
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
