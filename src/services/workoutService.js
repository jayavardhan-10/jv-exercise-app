import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const workoutService = {
  // Create a new workout
  createWorkout: async (userId, workoutData) => {
    try {
      const workoutsRef = collection(db, 'workouts');
      const workout = {
        ...workoutData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      const docRef = await addDoc(workoutsRef, workout);
      return { id: docRef.id, ...workout };
    } catch (error) {
      console.error('Error creating workout:', error);
      throw error;
    }
  },

  // Get all workouts for a user
  getUserWorkouts: async (userId) => {
    try {
      const workoutsRef = collection(db, 'workouts');
      const q = query(workoutsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting workouts:', error);
      throw error;
    }
  },

  // Update a workout
  updateWorkout: async (workoutId, updates) => {
    try {
      const workoutRef = doc(db, 'workouts', workoutId);
      await updateDoc(workoutRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating workout:', error);
      throw error;
    }
  },

  // Delete a workout
  deleteWorkout: async (workoutId) => {
    try {
      const workoutRef = doc(db, 'workouts', workoutId);
      await deleteDoc(workoutRef);
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw error;
    }
  },

  // Save workout history
  saveWorkoutHistory: async (userId, workoutId, historyData) => {
    try {
      const historyRef = collection(db, 'workout_history');
      const history = {
        userId,
        workoutId,
        ...historyData,
        completedAt: serverTimestamp()
      };
      const docRef = await addDoc(historyRef, history);
      return { id: docRef.id, ...history };
    } catch (error) {
      console.error('Error saving workout history:', error);
      throw error;
    }
  },

  // Get workout history for a user
  getUserWorkoutHistory: async (userId) => {
    try {
      const historyRef = collection(db, 'workout_history');
      const q = query(historyRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting workout history:', error);
      throw error;
    }
  }
}; 