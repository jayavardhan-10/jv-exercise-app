import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://jv-exercise-backend.onrender.com/api';

export const workoutHistoryService = {
  // Save a completed workout
  saveWorkout: async (workoutData) => {
    try {
      const response = await axios.post(`${API_URL}/workout-history`, workoutData);
      return response.data;
    } catch (error) {
      console.error('Error saving workout:', error);
      throw error;
    }
  },

  // Get user's workout history
  getWorkoutHistory: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/workout-history/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching workout history:', error);
      throw error;
    }
  },

  // Get streak data
  getStreakData: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/workout-history/${userId}/streak`);
      return response.data;
    } catch (error) {
      console.error('Error fetching streak data:', error);
      throw error;
    }
  }
}; 