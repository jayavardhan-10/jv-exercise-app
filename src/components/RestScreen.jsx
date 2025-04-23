import React, { useState, useEffect } from 'react';
import { useWorkout } from '../context/WorkoutContext';

const RestScreen = () => {
  const {
    currentWorkout,
    currentExerciseIndex,
    restTimeLeft,
    setRestTimeLeft,
    skipRest,
    addRestTime,
    completeRest,
  } = useWorkout();

  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let timer;
    if (!isPaused && restTimeLeft > 0) {
      timer = setInterval(() => {
        setRestTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            completeRest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [restTimeLeft, isPaused, completeRest, setRestTimeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const nextExercise = currentWorkout.exercises[currentExerciseIndex + 1];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-center mb-6">Rest Time</h1>

          {/* Timer */}
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-blue-600">
              {formatTime(restTimeLeft)}
            </div>
          </div>

          {/* Next Exercise Preview */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold mb-2">Next Exercise:</h2>
            <p className="text-lg text-blue-600">{nextExercise.name}</p>
            <p className="text-gray-600">Duration: {formatTime(nextExercise.duration)}</p>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={addRestTime}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              +20s
            </button>
            <button
              onClick={skipRest}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Skip Rest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestScreen; 