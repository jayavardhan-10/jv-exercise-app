import React, { useState, useEffect } from 'react';
import { useWorkout } from '../context/WorkoutContext';

const ExerciseExecutionScreen = () => {
  const {
    currentWorkout,
    currentExerciseIndex,
    completeExercise,
    skipExercise,
    previousExercise,
    exitWorkout,
  } = useWorkout();

  // Flatten the exercises array for the number of sets
  const setsCount = currentWorkout.sets || 1;
  const baseExercises = currentWorkout.exercises || [];
  const flattenedExercises = Array.from({ length: setsCount })
    .flatMap(() => baseExercises);

  const exercise = flattenedExercises[currentExerciseIndex];
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Timer logic
  useEffect(() => {
    let timer;
    if (!isPaused) {
      if (exercise.useDuration) {
        // Countdown
        if (elapsedTime < exercise.duration) {
          timer = setInterval(() => {
            setElapsedTime(prev => prev + 1);
          }, 1000);
        } else {
          // Auto-advance when time is up
          completeExercise();
        }
      } else {
        // Count up
        timer = setInterval(() => {
          setElapsedTime(prev => prev + 1);
        }, 1000);
      }
    }
    return () => clearInterval(timer);
  }, [isPaused, elapsedTime, exercise, completeExercise]);

  // Reset timer when exercise changes
  useEffect(() => {
    setElapsedTime(0);
    setIsPaused(false);
  }, [exercise]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExit = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    exitWorkout();
  };

  const cancelExit = () => {
    setShowExitConfirm(false);
  };

  const progress = ((currentExerciseIndex) / flattenedExercises.length) * 100;
  const setNumber = Math.floor(currentExerciseIndex / baseExercises.length) + 1;
  const exerciseNumber = (currentExerciseIndex % baseExercises.length) + 1;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-2 bg-gray-200">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Exit Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleExit}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Exit Workout
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <p className="text-center text-lg">
            Set {setNumber} of {setsCount} — Exercise {exerciseNumber} of {baseExercises.length}
          </p>
        </div>

        {/* Exercise Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-center mb-4">{exercise.name}</h1>
          
          <div className="flex justify-center mb-8">
            {exercise.gifUrl ? (
              <img
                src={exercise.gifUrl}
                alt={exercise.name}
                className="max-w-full h-64 object-contain rounded-lg"
              />
            ) : (
              <div className="bg-gray-100 h-64 w-full flex items-center justify-center rounded-lg">
                <p className="text-gray-500">No animation available</p>
              </div>
            )}
          </div>

          <div className="text-center mb-8">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Target</p>
                <p className="text-2xl font-bold text-blue-600">
                  {exercise.useDuration ? `${exercise.duration} sec` : `${exercise.reps} reps`}
                </p>
                <p className="text-sm text-gray-600">{exercise.useDuration ? 'Duration' : 'Reps'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Time</p>
                <p className="text-2xl font-bold text-gray-600">
                  {exercise.useDuration ? formatTime(Math.max(0, exercise.duration - elapsedTime)) : formatTime(elapsedTime)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={previousExercise}
              disabled={currentExerciseIndex === 0}
              className={`px-6 py-2 rounded-lg transition-colors ${
                currentExerciseIndex === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            {!exercise.useDuration && (
              <button
                onClick={completeExercise}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Done
              </button>
            )}
            <button
              onClick={skipExercise}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Skip
            </button>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Exit Workout?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to exit? Your progress will not be saved.
            </p>
            <div className="flex gap-4">
              <button
                onClick={confirmExit}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Exit
              </button>
              <button
                onClick={cancelExit}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Continue Workout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseExecutionScreen; 