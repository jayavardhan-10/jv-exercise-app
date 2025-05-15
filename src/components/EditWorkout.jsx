import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import ExerciseSelectionModal from './ExerciseSelectionModal';
import ReactSwitch from 'react-switch';

const EditWorkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateWorkout } = useWorkout();
  const [workoutName, setWorkoutName] = useState('');
  const [sets, setSets] = useState(1);
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
    setSets(workout.sets || 1);
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
      useDuration: false,
      reps: selectedExercise.defaultReps || 10,
      duration: 45,
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
        sets,
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

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <label className="block text-lg font-semibold text-gray-800 min-w-[120px]">Workout Name</label>
              <input
                type="text"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                className="w-full sm:w-80 rounded-xl border border-gray-300 px-4 py-2 text-base focus:border-blue-500 focus:ring-blue-500 transition-all shadow-sm"
                required
                placeholder="Enter workout name"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <label className="block text-lg font-semibold text-gray-800 min-w-[60px]">Sets</label>
              <input
                type="number"
                value={sets}
                onChange={e => setSets(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 rounded-full border border-gray-300 px-4 py-2 text-base focus:border-blue-500 focus:ring-blue-500 transition-all shadow-sm text-center"
                min="1"
                required
              />
              <span className="text-gray-500 text-base">(Number of times to repeat the whole workout)</span>
            </div>

            {/* Exercises Section */}
            <div className="mt-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h3 className="text-2xl font-bold text-gray-900">Exercises</h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-500 text-white px-6 py-2 rounded-full shadow hover:bg-blue-600 transition-all text-base font-semibold"
                >
                  Add Exercise
                </button>
              </div>
              <hr className="mb-8 border-gray-200" />
              <div className="space-y-8">
                {exercises.map((exercise) => (
                  <div key={exercise.id} className="border rounded-2xl p-6 bg-white shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-center gap-8">
                    <div className="flex-1 w-full flex flex-col gap-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-xl text-gray-900">{exercise.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveExercise(exercise.id)}
                          className="text-red-500 hover:text-red-700 transition-colors duration-200"
                          title="Remove Exercise"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <hr className="mb-2" />
                      <div className="flex items-center gap-3 mb-2">
                        <ReactSwitch
                          checked={exercise.useDuration}
                          onChange={checked => handleExerciseUpdate(exercise.id, 'useDuration', checked)}
                          onColor="#34c759"
                          offColor="#e5e7eb"
                          uncheckedIcon={false}
                          checkedIcon={false}
                          height={22}
                          width={44}
                          handleDiameter={20}
                          boxShadow="0 1px 3px rgba(0,0,0,0.12)"
                          activeBoxShadow="0 0 1px 2px #34c759"
                          className="duration-toggle"
                          id={`duration-toggle-${exercise.id}`}
                        />
                        <label htmlFor={`duration-toggle-${exercise.id}`} className="text-base text-gray-700 select-none cursor-pointer font-medium">
                          Duration
                        </label>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 w-full items-center">
                        {exercise.useDuration ? (
                          <div className="flex items-center gap-2 w-full">
                            <label className="text-base text-gray-600 font-medium">Duration</label>
                            <input
                              type="number"
                              value={exercise.duration}
                              onChange={e => handleExerciseUpdate(exercise.id, 'duration', parseInt(e.target.value))}
                              className="w-24 border-b-2 border-gray-300 focus:border-blue-500 outline-none bg-transparent text-lg px-2 py-1 transition-all"
                              min="1"
                              placeholder="sec"
                            />
                            <span className="text-gray-400 text-base">sec</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 w-full">
                            <label className="text-base text-gray-600 font-medium">Reps</label>
                            <input
                              type="number"
                              value={exercise.reps}
                              onChange={e => handleExerciseUpdate(exercise.id, 'reps', parseInt(e.target.value))}
                              className="w-24 border-b-2 border-gray-300 focus:border-blue-500 outline-none bg-transparent text-lg px-2 py-1 transition-all"
                              min="1"
                              placeholder="reps"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={exercise.gifUrl}
                        alt={exercise.name}
                        className="w-28 h-28 sm:w-32 sm:h-32 object-contain rounded-xl shadow border border-gray-200 bg-gray-50"
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