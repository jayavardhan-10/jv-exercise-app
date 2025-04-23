import React, { createContext, useContext, useState, useEffect } from 'react';

const WorkoutContext = createContext();

const LOCAL_STORAGE_KEY = 'workouts';

// Mock workout data for initial development
const mockWorkout = {
  id: 1,
  name: 'Default Workout',
  exercises: [
    { id: 1, name: 'Jumping Jacks', duration: 60, gifUrl: '' },
    { id: 2, name: 'Push-ups', duration: 45, gifUrl: '' },
    { id: 3, name: 'Squats', duration: 60, gifUrl: '' },
  ],
  defaultRestDuration: 20,
};

export const WorkoutProvider = ({ children }) => {
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [workoutProgress, setWorkoutProgress] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(20);
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [workoutEndTime, setWorkoutEndTime] = useState(null);
  const [workouts, setWorkouts] = useState(() => {
    const savedWorkouts = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedWorkouts ? JSON.parse(savedWorkouts) : [mockWorkout];
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(workouts));
  }, [workouts]);

  const createWorkout = (workoutData) => {
    const newWorkout = {
      id: Date.now(),
      ...workoutData,
      defaultRestDuration: 20,
    };
    setWorkouts([...workouts, newWorkout]);
  };

  const deleteWorkout = (workoutId) => {
    setWorkouts(workouts.filter(workout => workout.id !== workoutId));
  };

  const startWorkout = (workoutId) => {
    const workout = workouts.find(w => w.id === workoutId) || mockWorkout;
    setCurrentWorkout(workout);
    setCurrentExerciseIndex(0);
    setWorkoutProgress(0);
    setIsResting(false);
    setRestTimeLeft(workout.defaultRestDuration);
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
    workouts,
    createWorkout,
    deleteWorkout,
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