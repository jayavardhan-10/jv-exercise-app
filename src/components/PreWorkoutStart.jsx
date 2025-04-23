import React from 'react';
import { useWorkout } from '../context/WorkoutContext';

const PreWorkoutStart = ({ onStart }) => {
  const { currentWorkout } = useWorkout();

  const calculateTotalTime = (exercises) => {
    const exerciseTime = exercises.reduce((total, ex) => total + ex.duration, 0);
    const restTime = (exercises.length - 1) * 20; // 20 seconds rest between exercises
    return exerciseTime + restTime;
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes === 0) {
      return `${totalSeconds} seconds`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const totalTime = calculateTotalTime(currentWorkout.exercises);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6">{currentWorkout.name}</h1>
        
        <div className="space-y-6 mb-8">
          <div className="bg-blue-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Workout Overview</h2>
            <div className="space-y-3">
              <p className="flex justify-between">
                <span className="text-gray-600">Total Time:</span>
                <span className="font-semibold">{formatTime(totalTime)}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Exercises:</span>
                <span className="font-semibold">{currentWorkout.exercises.length}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Rest Between:</span>
                <span className="font-semibold">20 seconds</span>
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Exercise List</h2>
            <ul className="space-y-2">
              {currentWorkout.exercises.map((exercise, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="text-gray-600">{exercise.name}</span>
                  <span className="text-sm font-medium bg-gray-200 px-2 py-1 rounded">
                    {exercise.duration}s
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 duration-200"
        >
          Start Workout
        </button>
      </div>
    </div>
  );
};

export default PreWorkoutStart; 