import axios from 'axios';

// Determine if we're in development or production
const isProduction = import.meta.env.PROD;
// Make sure we always have the /api suffix
let baseUrl = import.meta.env.VITE_API_URL || 
  (isProduction 
    ? 'https://jv-exercise-backend.onrender.com' 
    : 'http://localhost:5000');

// Ensure URL doesn't end with trailing slash
if (baseUrl.endsWith('/')) {
  baseUrl = baseUrl.slice(0, -1);
}

// Ensure URL has /api path
const API_URL = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;

console.log('WorkoutHistory API URL:', API_URL);

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