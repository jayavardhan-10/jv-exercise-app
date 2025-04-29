import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import ExerciseSelectionModal from './ExerciseSelectionModal';

const EditWorkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateWorkout } = useWorkout();
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const workout = location.state?.workout;
    if (!workout) {
      navigate('/dashboard');
      return;
    }

    setWorkoutName(workout.name);
    setExercises(workout.exercises.map(ex => ({
      ...ex,
      id: Date.now() + Math.random() // Ensure unique IDs
    })));
  }, [location.state, navigate]);

  const handleExerciseSelect = (selectedExercise) => {
    setExercises([...exercises, {
      id: Date.now(),
      exerciseId: selectedExercise._id,
      name: selectedExercise.name,
      sets: selectedExercise.defaultSets || 3,
      reps: selectedExercise.defaultReps || 10,
      weight: 0,
      gifUrl: selectedExercise.gifUrl,
      instructions: selectedExercise.instructions
    }]);
  };

  const handleRemoveExercise = (id) => {
    setExercises(exercises.filter(exercise => exercise.id !== id));
  };

  const handleExerciseUpdate = (id, field, value) => {
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

    if (exercises.length === 0) {
      setError('Please add at least one exercise');
      return;
    }

    try {
      setLoading(true);
      const workout = location.state?.workout;
      if (!workout) {
        throw new Error('No workout found to edit');
      }

      await updateWorkout(workout.id, {
        name: workoutName,
        exercises: exercises.map(({ id, ...rest }) => rest),
        updatedAt: new Date().toISOString()
      });
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to update workout: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Edit Workout</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Workout Name
              </label>
              <input
                type="text"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Exercises</h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Add Exercise
                </button>
              </div>

              <div className="space-y-4">
                {exercises.map((exercise) => (
                  <div key={exercise.id} className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{exercise.name}</h4>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div>
                            <label className="block text-sm text-gray-600">Sets</label>
                            <input
                              type="number"
                              value={exercise.sets}
                              onChange={(e) => handleExerciseUpdate(exercise.id, 'sets', parseInt(e.target.value))}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              min="1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600">Reps</label>
                            <input
                              type="number"
                              value={exercise.reps}
                              onChange={(e) => handleExerciseUpdate(exercise.id, 'reps', parseInt(e.target.value))}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              min="1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600">Weight (kg)</label>
                            <input
                              type="number"
                              value={exercise.weight}
                              onChange={(e) => handleExerciseUpdate(exercise.id, 'weight', parseFloat(e.target.value))}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              min="0"
                              step="0.5"
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveExercise(exercise.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Preview GIF */}
                    <div className="mt-4">
                      <img
                        src={exercise.gifUrl}
                        alt={exercise.name}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <ExerciseSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onExerciseSelect={handleExerciseSelect}
      />
    </div>
  );
};

export default EditWorkout; 