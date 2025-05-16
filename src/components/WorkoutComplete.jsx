import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import { useWorkoutHistory } from '../context/WorkoutHistoryContext';
import confetti from 'canvas-confetti';

const WorkoutComplete = () => {
  const navigate = useNavigate();
  const { getTotalWorkoutTime, currentWorkout } = useWorkout();
  const { saveWorkout, streak, refreshHistory } = useWorkoutHistory();
  const hasSaved = useRef(false);
  const [showStreakAnimation, setShowStreakAnimation] = useState(false);
  const [savedStreak, setSavedStreak] = useState(0);

  useEffect(() => {
    if (!hasSaved.current && currentWorkout) {
      hasSaved.current = true;
      const workoutData = {
        workoutId: currentWorkout.id || currentWorkout._id || 'custom',
        workoutName: currentWorkout.name || 'Custom Workout',
        date: new Date(),
        duration: getTotalWorkoutTime() / 60, // convert seconds to minutes
        exercises: currentWorkout.exercises || [],
        totalExercises: currentWorkout.exercises?.length || 0,
        intensity: Math.round((getTotalWorkoutTime() / 60) + (currentWorkout.exercises?.length || 0))
      };
      saveWorkout(workoutData)
        .then(() => {
          // Wait for backend to recalculate streak, then update UI
          refreshHistory().then(() => {
            setSavedStreak(streak); // Use the backend value
            setShowStreakAnimation(true);
          });
        })
        .catch(err => console.error('Error saving workout:', err));
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
  }, [currentWorkout, getTotalWorkoutTime, saveWorkout, refreshHistory, streak]);

  // Update savedStreak when streak changes (after refresh)
  useEffect(() => {
    setSavedStreak(streak);
  }, [streak]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Total Time
            </h2>
            <p className="text-4xl font-bold text-blue-600">
              {formatTime(totalTime)} min
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
        {/* Streak Card */}
        <div className={`bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl p-6 mb-8 relative overflow-hidden ${showStreakAnimation ? 'streak-pulse' : ''}`}>
          <div className="flex items-center justify-center">
            <span className="text-4xl mr-3">🔥</span>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                Current Streak
              </h2>
              <p className="text-4xl font-bold text-orange-600">
                {savedStreak} {savedStreak === 1 ? 'day' : 'days'}
              </p>
            </div>
          </div>
          {showStreakAnimation && (
            <div className="absolute inset-0 bg-orange-300 opacity-30 streak-ripple"></div>
          )}
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
      <style jsx="true">{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes ripple {
          0% { transform: scale(0); opacity: 0.5; }
          100% { transform: scale(2); opacity: 0; }
        }
        .streak-pulse {
          animation: pulse 1.5s infinite;
        }
        .streak-ripple {
          animation: ripple 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default WorkoutComplete; 