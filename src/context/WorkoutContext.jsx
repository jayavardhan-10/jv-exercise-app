import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { workoutService } from '../services/workoutService';

const WorkoutContext = createContext();

const LOCAL_STORAGE_KEY = 'workouts';
const DEFAULT_REST_TIME = 20; // Default rest time in seconds

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

export const useWorkout = () => {
  return useContext(WorkoutContext);
};

export const WorkoutProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [workoutEndTime, setWorkoutEndTime] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(DEFAULT_REST_TIME);
  const [workoutHistory, setWorkoutHistory] = useState([]);

  // Load workouts from localStorage on mount
  useEffect(() => {
    const loadWorkouts = () => {
      try {
        const savedWorkouts = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedWorkouts) {
          setWorkouts(JSON.parse(savedWorkouts));
        }
      } catch (error) {
        console.error('Error loading workouts:', error);
      }
    };

    loadWorkouts();
  }, []);

  // Save workouts to localStorage whenever they change
  useEffect(() => {
    if (workouts.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(workouts));
    }
  }, [workouts]);

  const loadUserWorkouts = async () => {
    try {
      const userWorkouts = await workoutService.getUserWorkouts(currentUser.uid);
      setWorkouts(userWorkouts);
    } catch (error) {
      console.error('Error loading workouts:', error);
    }
  };

  const loadWorkoutHistory = async () => {
    try {
      const history = await workoutService.getUserWorkoutHistory(currentUser.uid);
      setWorkoutHistory(history);
    } catch (error) {
      console.error('Error loading workout history:', error);
    }
  };

  const createWorkout = async (workoutData) => {
    try {
      const newWorkout = {
        id: Date.now().toString(),
        ...workoutData,
        userId: currentUser?.uid
      };
      
      setWorkouts(prevWorkouts => [...prevWorkouts, newWorkout]);
      return newWorkout;
    } catch (error) {
      console.error('Error creating workout:', error);
      throw error;
    }
  };

  const updateWorkout = async (workoutId, updates) => {
    try {
      setWorkouts(prevWorkouts => 
        prevWorkouts.map(workout => 
          workout.id === workoutId 
            ? { ...workout, ...updates }
            : workout
        )
      );
    } catch (error) {
      console.error('Error updating workout:', error);
      throw error;
    }
  };

  const deleteWorkout = (workoutId) => {
    try {
      setWorkouts(prevWorkouts => prevWorkouts.filter(workout => workout.id !== workoutId));
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw error;
    }
  };

  const startWorkout = (workout) => {
    setCurrentWorkout(workout);
    setCurrentExerciseIndex(0);
    setIsWorkoutComplete(false);
    setIsResting(false);
    setWorkoutStartTime(Date.now());
    setWorkoutEndTime(null);
    setRestTimeLeft(DEFAULT_REST_TIME);
  };

  const completeExercise = () => {
    // Flattened exercise count
    const setsCount = currentWorkout.sets || 1;
    const baseExercises = currentWorkout.exercises || [];
    const totalExercises = setsCount * baseExercises.length;
    if (currentExerciseIndex < totalExercises - 1) {
      setIsResting(true);
      setRestTimeLeft(DEFAULT_REST_TIME);
    } else {
      // This is the last exercise, complete the workout
      setWorkoutEndTime(Date.now());
      setIsWorkoutComplete(true);
      setCurrentExerciseIndex(0);
      setIsResting(false);
    }
  };

  const skipExercise = () => {
    // Flattened exercise count
    const setsCount = currentWorkout.sets || 1;
    const baseExercises = currentWorkout.exercises || [];
    const totalExercises = setsCount * baseExercises.length;
    if (currentExerciseIndex < totalExercises - 1) {
      setIsResting(true);
      setRestTimeLeft(DEFAULT_REST_TIME);
    } else {
      // This is the last exercise, complete the workout
      setWorkoutEndTime(Date.now());
      setIsWorkoutComplete(true);
      setCurrentExerciseIndex(0);
      setIsResting(false);
    }
  };

  const completeRest = () => {
    setIsResting(false);
    setCurrentExerciseIndex(prev => prev + 1);
    setRestTimeLeft(DEFAULT_REST_TIME);
  };

  const skipRest = () => {
    setIsResting(false);
    setCurrentExerciseIndex(prev => prev + 1);
    setRestTimeLeft(DEFAULT_REST_TIME);
  };

  const addRestTime = () => {
    setRestTimeLeft(prev => prev + 20);
  };

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
      setIsResting(false);
    }
  };

  const exitWorkout = () => {
    setCurrentWorkout(null);
    setCurrentExerciseIndex(0);
    setIsResting(false);
    setIsWorkoutComplete(false);
    setWorkoutEndTime(null);
    setRestTimeLeft(DEFAULT_REST_TIME);
  };

  const getTotalWorkoutTime = () => {
    if (!workoutStartTime || !workoutEndTime) return 0;
    return Math.floor((workoutEndTime - workoutStartTime) / 1000); // Convert to seconds
  };

  const getCurrentExercise = () => {
    if (!currentWorkout || !currentWorkout.exercises) return null;
    return currentWorkout.exercises[currentExerciseIndex];
  };

  const value = {
    workouts,
    currentWorkout,
    currentExerciseIndex,
    isResting,
    isWorkoutComplete,
    workoutHistory,
    workoutStartTime,
    workoutEndTime,
    restTimeLeft,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    startWorkout,
    completeExercise,
    skipExercise,
    completeRest,
    skipRest,
    addRestTime,
    previousExercise,
    exitWorkout,
    getTotalWorkoutTime,
    getCurrentExercise,
    setRestTimeLeft
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};

export default WorkoutContext; 