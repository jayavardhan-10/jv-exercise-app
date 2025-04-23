import React, { useState, useEffect } from 'react';
import { useWorkout } from '../context/WorkoutContext';

const ExerciseExecutionScreen = () => {
  const {
    currentWorkout,
    currentExerciseIndex,
    completeExercise,
    skipExercise,
    previousExercise,
  } = useWorkout();

  const exercise = currentWorkout.exercises[currentExerciseIndex];
  const [timeLeft, setTimeLeft] = useState(exercise.duration);
  const [isPaused, setIsPaused] = useState(false);

  // Reset timer when exercise changes
  useEffect(() => {
    setTimeLeft(exercise.duration);
  }, [exercise]);

  useEffect(() => {
    let timer;
    if (!isPaused && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            completeExercise();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft, isPaused, completeExercise]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Indicator */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <p className="text-center text-lg">
            Exercise {currentExerciseIndex + 1} of {currentWorkout.exercises.length}
          </p>
        </div>

        {/* Exercise Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-center mb-4">{exercise.name}</h1>
          
          {/* Exercise GIF/Image Placeholder */}
          <div className="w-full h-64 bg-gray-200 rounded-lg mb-6 flex items-center justify-center">
            <p className="text-gray-500">Exercise GIF/Image</p>
          </div>

          {/* Timer */}
          <div className="text-center mb-6">
            <div className="text-6xl font-bold text-blue-600">
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Controls */}
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
            <button
              onClick={skipExercise}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseExecutionScreen; 