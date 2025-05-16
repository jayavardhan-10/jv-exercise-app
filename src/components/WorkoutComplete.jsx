import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import { useWorkoutHistory } from '../context/WorkoutHistoryContext';
import confetti from 'canvas-confetti';

const WorkoutComplete = () => {
  const navigate = useNavigate();
  const { getTotalWorkoutTime, currentWorkout } = useWorkout();
  const { saveWorkout } = useWorkoutHistory();
  const hasSaved = useRef(false);

  useEffect(() => {
    // Save workout only once
    if (!hasSaved.current && currentWorkout) {
      hasSaved.current = true;
      saveWorkout({
        workoutId: currentWorkout.id || currentWorkout._id || 'custom',
        workoutName: currentWorkout.name || 'Custom Workout',
        date: new Date(),
        duration: getTotalWorkoutTime() / 60, // convert seconds to minutes
        exercises: currentWorkout.exercises || [],
        totalExercises: currentWorkout.exercises?.length || 0,
        intensity: Math.round((getTotalWorkoutTime() / 60) + (currentWorkout.exercises?.length || 0))
      });
    }
    // Trigger confetti animation
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, [currentWorkout, getTotalWorkoutTime, saveWorkout]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')} minutes`;
  };

  const totalTime = getTotalWorkoutTime();
  const exercisesCompleted = currentWorkout?.exercises?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-600 p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center transform animate-fade-in-up">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-blue-600 mb-4">
            Workout Complete! 🎉
          </h1>
          <p className="text-2xl text-gray-700">
            Great job on completing your workout!
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-12">
          <div className="bg-blue-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Total Time
            </h2>
            <p className="text-4xl font-bold text-blue-600">
              {formatTime(totalTime)}
            </p>
          </div>
          <div className="bg-green-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Exercises Completed
            </h2>
            <p className="text-4xl font-bold text-green-600">
              {exercisesCompleted}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors transform hover:scale-105 duration-200"
          >
            Return to Dashboard
          </button>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition-colors transform hover:scale-105 duration-200"
          >
            Start New Workout
          </button>
        </div>

        <div className="mt-8 text-gray-600">
          <p className="text-lg">Keep up the great work! 💪</p>
          <p>Remember to stay hydrated and rest well.</p>
        </div>
      </div>
    </div>
  );
};

export default WorkoutComplete; 