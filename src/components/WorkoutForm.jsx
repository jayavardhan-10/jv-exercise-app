import React, { useState } from 'react';
import ExerciseSelectionModal from './ExerciseSelectionModal';

const WorkoutForm = ({ onSubmit, initialData = null }) => {
  const [workoutName, setWorkoutName] = useState(initialData?.name || '');
  const [exercises, setExercises] = useState(initialData?.exercises || []);
  const [sets, setSets] = useState(initialData?.sets || 1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: workoutName,
      sets,
      exercises: exercises
    });
  };

  const handleExerciseSelect = (selectedExercise) => {
    setExercises([...exercises, {
      exerciseId: selectedExercise._id,
      name: selectedExercise.name,
      useDuration: false,
      reps: selectedExercise.defaultReps,
      duration: 45,
      gifUrl: selectedExercise.gifUrl,
      instructions: selectedExercise.instructions
    }]);
  };

  const handleExerciseUpdate = (index, field, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value
    };
    setExercises(updatedExercises);
  };

  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
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
          <label className="block text-sm font-medium text-gray-700">
            Sets (Number of times to repeat the whole workout)
          </label>
          <input
            type="number"
            value={sets}
            onChange={e => setSets(Math.max(1, parseInt(e.target.value) || 1))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="1"
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
            {exercises.map((exercise, index) => (
              <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{exercise.name}</h4>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={exercise.useDuration}
                          onChange={e => handleExerciseUpdate(index, 'useDuration', e.target.checked)}
                          id={`duration-toggle-${index}`}
                        />
                        <label htmlFor={`duration-toggle-${index}`} className="text-sm text-gray-600">Duration</label>
                      </div>
                      {exercise.useDuration ? (
                        <div>
                          <label className="block text-sm text-gray-600">Duration (s)</label>
                          <input
                            type="number"
                            value={exercise.duration}
                            onChange={e => handleExerciseUpdate(index, 'duration', parseInt(e.target.value))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            min="1"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm text-gray-600">Reps</label>
                          <input
                            type="number"
                            value={exercise.reps}
                            onChange={e => handleExerciseUpdate(index, 'reps', parseInt(e.target.value))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            min="1"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExercise(index)}
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
                  {exercise.name === 'High Knees' ? (
                    <div className="gif-white-bg">
                      <img
                        src={exercise.gifUrl}
                        alt={exercise.name}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <img
                      src={exercise.gifUrl}
                      alt={exercise.name}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
          >
            Save Workout
          </button>
        </div>
      </form>

      <ExerciseSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onExerciseSelect={handleExerciseSelect}
      />
    </div>
  );
};

export default WorkoutForm; 