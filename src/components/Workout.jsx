import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import PreWorkoutStart from './PreWorkoutStart';
import PreWorkoutCountdown from './PreWorkoutCountdown';
import ExerciseExecutionScreen from './ExerciseExecutionScreen';
import RestScreen from './RestScreen';
import WorkoutComplete from './WorkoutComplete';

const Workout = () => {
  const navigate = useNavigate();
  const {
    currentWorkout,
    currentExerciseIndex,
    isResting,
    isWorkoutComplete,
    workoutStartTime,
    workoutEndTime,
  } = useWorkout();

  const [showStart, setShowStart] = useState(true);
  const [showCountdown, setShowCountdown] = useState(false);

  // Redirect to dashboard if no workout is selected and not completed
  if (!currentWorkout && !isWorkoutComplete) {
    navigate('/dashboard');
    return null;
  }

  // Show workout complete screen
  if (isWorkoutComplete) {
    return <WorkoutComplete />;
  }

  // Show start page
  if (showStart) {
    return <PreWorkoutStart onStart={() => {
      setShowStart(false);
      setShowCountdown(true);
    }} />;
  }

  // Show pre-workout countdown
  if (showCountdown) {
    return (
      <PreWorkoutCountdown
        onCountdownComplete={() => setShowCountdown(false)}
        firstExercise={currentWorkout.exercises[0].name}
      />
    );
  }

  // Show rest screen between exercises
  if (isResting) {
    return <RestScreen />;
  }

  // Show exercise execution screen
  return <ExerciseExecutionScreen />;
};

export default Workout; 