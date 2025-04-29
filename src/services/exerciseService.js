const API_URL = 'http://localhost:5000/api';

export const exerciseService = {
  // Get all exercises
  getAllExercises: async () => {
    try {
      const response = await fetch(`${API_URL}/exercises`);
      if (!response.ok) throw new Error('Failed to fetch exercises');
      return await response.json();
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw error;
    }
  },

  // Get a single exercise by ID
  getExerciseById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/exercises/${id}`);
      if (!response.ok) throw new Error('Failed to fetch exercise');
      return await response.json();
    } catch (error) {
      console.error('Error fetching exercise:', error);
      throw error;
    }
  },

  // Create a new exercise
  createExercise: async (exerciseData) => {
    try {
      const response = await fetch(`${API_URL}/exercises`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exerciseData),
      });
      if (!response.ok) throw new Error('Failed to create exercise');
      return await response.json();
    } catch (error) {
      console.error('Error creating exercise:', error);
      throw error;
    }
  },

  // Update an exercise
  updateExercise: async (id, updates) => {
    try {
      const response = await fetch(`${API_URL}/exercises/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update exercise');
      return await response.json();
    } catch (error) {
      console.error('Error updating exercise:', error);
      throw error;
    }
  },

  // Delete an exercise
  deleteExercise: async (id) => {
    try {
      const response = await fetch(`${API_URL}/exercises/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete exercise');
      return await response.json();
    } catch (error) {
      console.error('Error deleting exercise:', error);
      throw error;
    }
  },
}; 