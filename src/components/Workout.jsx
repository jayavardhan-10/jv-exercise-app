import React, { useState, useEffect } from 'react';
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
  
  // Use useEffect to navigate to dashboard if no workout is selected
  useEffect(() => {
    if (!currentWorkout && !isWorkoutComplete) {
      navigate('/dashboard');
    }
  }, [currentWorkout, isWorkoutComplete, navigate]);

  // If no workout and not completed, return empty component 
  // while the navigation effect runs
  if (!currentWorkout && !isWorkoutComplete) {
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
        firstExercise={currentWorkout.exercises[0]?.name || 'First Exercise'}
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