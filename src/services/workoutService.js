const API_URL = 'http://localhost:5000/api';

export const workoutService = {
  // Get all workouts
  getAllWorkouts: async () => {
    try {
      const response = await fetch(`${API_URL}/workouts`);
      if (!response.ok) throw new Error('Failed to fetch workouts');
      return await response.json();
    } catch (error) {
      console.error('Error fetching workouts:', error);
      throw error;
    }
  },

  // Get a single workout by ID
  getWorkoutById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/workouts/${id}`);
      if (!response.ok) throw new Error('Failed to fetch workout');
      return await response.json();
    } catch (error) {
      console.error('Error fetching workout:', error);
      throw error;
    }
  },

  // Create a new workout
  createWorkout: async (workoutData) => {
    try {
      const response = await fetch(`${API_URL}/workouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutData),
      });
      if (!response.ok) throw new Error('Failed to create workout');
      return await response.json();
    } catch (error) {
      console.error('Error creating workout:', error);
      throw error;
    }
  },

  // Update a workout
  updateWorkout: async (id, updates) => {
    try {
      const response = await fetch(`${API_URL}/workouts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update workout');
      return await response.json();
    } catch (error) {
      console.error('Error updating workout:', error);
      throw error;
    }
  },

  // Delete a workout
  deleteWorkout: async (id) => {
    try {
      const response = await fetch(`${API_URL}/workouts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete workout');
      return await response.json();
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw error;
    }
  },

  // Save workout history
  saveWorkoutHistory: async (workoutHistoryData) => {
    try {
      const response = await fetch(`${API_URL}/workouts/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutHistoryData),
      });
      if (!response.ok) throw new Error('Failed to save workout history');
      return await response.json();
    } catch (error) {
      console.error('Error saving workout history:', error);
      throw error;
    }
  },

  // Get workout history
  getWorkoutHistory: async () => {
    try {
      const response = await fetch(`${API_URL}/workouts/history`);
      if (!response.ok) throw new Error('Failed to fetch workout history');
      return await response.json();
    } catch (error) {
      console.error('Error fetching workout history:', error);
      throw error;
    }
  },
}; 