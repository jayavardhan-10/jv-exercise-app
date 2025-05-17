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

console.log('Environment:', isProduction ? 'production' : 'development');
console.log('API URL:', API_URL);

export const exerciseService = {
  // Get all exercises
  getAllExercises: async () => {
    try {
      console.log('Fetching exercises from:', `${API_URL}/exercises`);
      const response = await fetch(`${API_URL}/exercises`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch exercises: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Received data length:', data.length);
      return data;
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