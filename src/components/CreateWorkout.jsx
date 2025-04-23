import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';

const CreateWorkout = () => {
  const navigate = useNavigate();
  const { createWorkout } = useWorkout();
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState([
    { id: Date.now(), name: '', duration: 30 }
  ]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddExercise = () => {
    setExercises([...exercises, { id: Date.now(), name: '', duration: 30 }]);
  };

  const handleRemoveExercise = (id) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter(exercise => exercise.id !== id));
    }
  };

  const handleExerciseChange = (id, field, value) => {
    setExercises(exercises.map(exercise => {
      if (exercise.id === id) {
        return { ...exercise, [field]: value };
      }
      return exercise;
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!workoutName.trim()) {
      setError('Please enter a workout name');
      return;
    }

    if (exercises.some(ex => !ex.name.trim())) {
      setError('Please fill in all exercise names');
      return;
    }

    try {
      setLoading(true);
      await createWorkout({
        name: workoutName,
        exercises: exercises.map(({ id, ...rest }) => rest),
        createdAt: new Date().toISOString()
      });
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to create workout: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Create New Workout</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="workoutName" className="block text-sm font-medium text-gray-700">
                Workout Name
              </label>
              <input
                type="text"
                id="workoutName"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter workout name"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Exercises</h3>
                <button
                  type="button"
                  onClick={handleAddExercise}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Exercise
                </button>
              </div>

              {exercises.map((exercise, index) => (
                <div key={exercise.id} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Exercise Name
                    </label>
                    <input
                      type="text"
                      value={exercise.name}
                      onChange={(e) => handleExerciseChange(exercise.id, 'name', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter exercise name"
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-sm font-medium text-gray-700">
                      Duration (s)
                    </label>
                    <input
                      type="number"
                      value={exercise.duration}
                      onChange={(e) => handleExerciseChange(exercise.id, 'duration', parseInt(e.target.value) || 0)}
                      min="1"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {exercises.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveExercise(exercise.id)}
                      className="mt-6 text-red-600 hover:text-red-800"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              >
                {loading ? 'Creating...' : 'Create Workout'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
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