import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { workoutHistoryService } from '../services/workoutHistoryService';

const WorkoutHistoryContext = createContext();

export const useWorkoutHistory = () => {
  const context = useContext(WorkoutHistoryContext);
  if (!context) {
    throw new Error('useWorkoutHistory must be used within a WorkoutHistoryProvider');
  }
  return context;
};

export const WorkoutHistoryProvider = ({ children }) => {
  const { user } = useAuth();
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [streak, setStreak] = useState(0);
  const [streakData, setStreakData] = useState({
    lastWorkout: null,
    streakDates: [],
    totalWorkouts: 0,
    longestStreak: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWorkoutHistory();
    }
  }, [user]);

  const loadWorkoutHistory = async () => {
    try {
      setLoading(true);
      const history = await workoutHistoryService.getWorkoutHistory(user.uid);
      setWorkoutHistory(history);
      
      const streakResponse = await workoutHistoryService.getStreakData(user.uid);
      setStreak(streakResponse.streak);
      setStreakData({
        lastWorkout: streakResponse.lastWorkout,
        streakDates: streakResponse.streakDates || [],
        totalWorkouts: streakResponse.totalWorkouts || 0,
        longestStreak: streakResponse.longestStreak || 0
      });
    } catch (error) {
      console.error('Error loading workout history:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveWorkout = async (workoutData) => {
    try {
      console.log('[DEBUG] Saving workout:', workoutData);
      const savedWorkout = await workoutHistoryService.saveWorkout({
        ...workoutData,
        userId: user.uid
      });
      
      setWorkoutHistory(prev => [savedWorkout, ...prev]);
      await loadWorkoutHistory(); // Reload to update streak
      
      return savedWorkout;
    } catch (error) {
      console.error('Error saving workout:', error);
      throw error;
    }
  };

  const value = {
    workoutHistory,
    streak,
    streakData,
    loading,
    saveWorkout,
    refreshHistory: loadWorkoutHistory
  };

  return (
    <WorkoutHistoryContext.Provider value={value}>
      {children}
    </WorkoutHistoryContext.Provider>
  );
}; 