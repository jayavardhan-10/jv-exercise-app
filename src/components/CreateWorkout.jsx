import React, { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';

const CreateWorkout = () => {
  const { createWorkout } = useWorkout();
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState([
    { id: 1, name: '', duration: '', unit: 'seconds' }
  ]);

  const handleAddExercise = () => {
    setExercises([
      ...exercises,
      { id: exercises.length + 1, name: '', duration: '', unit: 'seconds' }
    ]);
  };

  const handleRemoveExercise = (id) => {
    setExercises(exercises.filter(exercise => exercise.id !== id));
  };

  const handleExerciseChange = (id, field, value) => {
    setExercises(exercises.map(exercise => {
      if (exercise.id === id) {
        return { ...exercise, [field]: value };
      }
      return exercise;
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedExercises = exercises.map(exercise => ({
      name: exercise.name,
      duration: exercise.unit === 'minutes' 
        ? parseInt(exercise.duration) * 60 
        : parseInt(exercise.duration)
    }));

    createWorkout({
      name: workoutName,
      exercises: formattedExercises
    });

    // Redirect back to dashboard
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6">Create New Workout</h1>
          
          <form onSubmit={handleSubmit}>
            {/* Workout Name */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Workout Name
              </label>
              <input
                type="text"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter workout name"
                required
              />
            </div>

            {/* Exercises */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Exercises
              </label>
              {exercises.map((exercise) => (
                <div key={exercise.id} className="flex gap-4 mb-4">
                  <input
                    type="text"
                    value={exercise.name}
                    onChange={(e) => handleExerciseChange(exercise.id, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Exercise name"
                    required
                  />
                  <input
                    type="number"
                    value={exercise.duration}
                    onChange={(e) => handleExerciseChange(exercise.id, 'duration', e.target.value)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Time"
                    required
                    min="1"
                  />
                  <select
                    value={exercise.unit}
                    onChange={(e) => handleExerciseChange(exercise.id, 'unit', e.target.value)}
                    className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="seconds">Seconds</option>
                    <option value="minutes">Minutes</option>
                  </select>
                  {exercises.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveExercise(exercise.id)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={handleAddExercise}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors mb-4"
              >
                + Add Exercise
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Workout
              </button>
              <button
                type="button"
                onClick={() => window.location.href = '/'}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkout; 