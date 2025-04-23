import React, { createContext, useContext, useState } from 'react';

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [workoutProgress, setWorkoutProgress] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(20);
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [workoutEndTime, setWorkoutEndTime] = useState(null);

  // Mock workout data for initial development
  const mockWorkout = {
    id: 1,
    name: 'Day 1 Workout',
    exercises: [
      { id: 1, name: 'Jumping Jacks', duration: 60, gifUrl: '' },
      { id: 2, name: 'Push-ups', duration: 45, gifUrl: '' },
      { id: 3, name: 'Squats', duration: 60, gifUrl: '' },
    ],
    defaultRestDuration: 20,
  };

  const startWorkout = (workoutId) => {
    setCurrentWorkout(mockWorkout);
    setCurrentExerciseIndex(0);
    setWorkoutProgress(0);
    setIsResting(false);
    setRestTimeLeft(mockWorkout.defaultRestDuration);
    setIsWorkoutComplete(false);
    setWorkoutStartTime(Date.now());
    setWorkoutEndTime(null);
  };

  const completeExercise = () => {
    if (currentExerciseIndex < currentWorkout.exercises.length - 1) {
      setIsResting(true);
      setRestTimeLeft(currentWorkout.defaultRestDuration);
    } else {
      setIsWorkoutComplete(true);
      setWorkoutProgress(100);
      setWorkoutEndTime(Date.now());
    }
  };

  const completeRest = () => {
    setIsResting(false);
    setCurrentExerciseIndex((prev) => prev + 1);
    setWorkoutProgress(
      ((currentExerciseIndex + 1) / currentWorkout.exercises.length) * 100
    );
  };

  const skipRest = () => {
    completeRest();
  };

  const addRestTime = () => {
    setRestTimeLeft((prev) => prev + 20);
  };

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prev) => prev - 1);
      setIsResting(false);
    }
  };

  const skipExercise = () => {
    if (currentExerciseIndex < currentWorkout.exercises.length - 1) {
      setIsResting(true);
      setRestTimeLeft(currentWorkout.defaultRestDuration);
      setWorkoutProgress(
        ((currentExerciseIndex + 1) / currentWorkout.exercises.length) * 100
      );
    } else {
      setIsWorkoutComplete(true);
      setWorkoutProgress(100);
      setWorkoutEndTime(Date.now());
    }
  };

  const getTotalWorkoutTime = () => {
    if (!workoutStartTime || !workoutEndTime) return 0;
    return Math.floor((workoutEndTime - workoutStartTime) / 1000);
  };

  const value = {
    currentWorkout,
    currentExerciseIndex,
    workoutProgress,
    isResting,
    restTimeLeft,
    setRestTimeLeft,
    isWorkoutComplete,
    getTotalWorkoutTime,
    startWorkout,
    completeExercise,
    completeRest,
    skipExercise,
    skipRest,
    addRestTime,
    previousExercise,
    mockWorkout,
  };

  return (
    <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}; 