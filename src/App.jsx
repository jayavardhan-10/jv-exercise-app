import React, { useState } from 'react';
import { WorkoutProvider, useWorkout } from './context/WorkoutContext';
import WorkoutPlanDashboard from './components/WorkoutPlanDashboard';
import PreWorkoutCountdown from './components/PreWorkoutCountdown';
import ExerciseExecutionScreen from './components/ExerciseExecutionScreen';
import RestScreen from './components/RestScreen';
import WorkoutComplete from './components/WorkoutComplete';
import './App.css'

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

  const handleStartWorkout = (workoutId) => {
    startWorkout(workoutId);
    setShowCountdown(true);
  };

  const handleCountdownComplete = () => {
    setShowCountdown(false);
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

  return <WorkoutPlanDashboard onStartWorkout={handleStartWorkout} />;
};

function App() {
  return (
    <WorkoutProvider>
      <AppContent />
    </WorkoutProvider>
  );
}

export default App;
