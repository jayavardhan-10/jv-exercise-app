import React from 'react';
import { useWorkout } from '../context/WorkoutContext';

const WorkoutComplete = () => {
  const { getTotalWorkoutTime } = useWorkout();

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const totalTime = getTotalWorkoutTime();

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-600 mb-4">
            Congratulations! 🎉
          </h1>
          <p className="text-xl text-gray-700">
            You've completed your workout!
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Total Workout Time
          </h2>
          <p className="text-3xl font-bold text-blue-600">
            {formatTime(totalTime)}
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition-colors"
        >
          Start New Workout
        </button>
      </div>
    </div>
  );
};

export default WorkoutComplete; 