import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';

const WorkoutSession = () => {
  const navigate = useNavigate();
  const {
    currentWorkout,
    currentExerciseIndex,
    isResting,
    isWorkoutComplete,
    completeExercise,
    skipExercise,
    completeRest,
    getTotalWorkoutTime
  } = useWorkout();

  const [timer, setTimer] = useState(0);
  const [restTimer, setRestTimer] = useState(20); // Default rest time
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!currentWorkout) {
      navigate('/dashboard');
      return;
    }
  }, [currentWorkout, navigate]);

  useEffect(() => {
    let interval;

    if (!isPaused && !isWorkoutComplete) {
      if (isResting) {
        if (restTimer > 0) {
          interval = setInterval(() => {
            setRestTimer((prev) => prev - 1);
          }, 1000);
        } else {
          completeRest();
          setRestTimer(20); // Reset rest timer for next rest period
        }
      } else {
        const currentExercise = currentWorkout?.exercises[currentExerciseIndex];
        if (currentExercise && timer < currentExercise.duration) {
          interval = setInterval(() => {
            setTimer((prev) => prev + 1);
          }, 1000);
        } else if (currentExercise) {
          completeExercise();
          setTimer(0); // Reset exercise timer for next exercise
        }
      }
    }

    return () => clearInterval(interval);
  }, [timer, restTimer, isPaused, isResting, currentWorkout, currentExerciseIndex, completeExercise, completeRest]);

  if (!currentWorkout) return null;

  // Flatten the exercises array for the number of sets
  const setsCount = currentWorkout.sets || 1;
  const baseExercises = currentWorkout.exercises || [];
  const flattenedExercises = Array.from({ length: setsCount })
    .flatMap(() => baseExercises);

  const currentExercise = flattenedExercises[currentExerciseIndex];
  const nextExercise = flattenedExercises[currentExerciseIndex + 1];
  const progress = (currentExerciseIndex / flattenedExercises.length) * 100;

  // Calculate current set and exercise within set
  const setNumber = Math.floor(currentExerciseIndex / baseExercises.length) + 1;
  const exerciseNumber = (currentExerciseIndex % baseExercises.length) + 1;

  if (isWorkoutComplete) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-center mb-6">Workout Complete! 🎉</h2>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-lg">Total Time:</p>
              <p className="text-3xl font-bold">{Math.floor(getTotalWorkoutTime() / 60)} minutes</p>
            </div>
            <div className="text-center">
              <p className="text-lg">Exercises Completed:</p>
              <p className="text-3xl font-bold">{currentWorkout.exercises.length}</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200">
        <div
          className="h-full bg-blue-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {isResting ? (
          // Rest Screen
          <div className="bg-white rounded-lg shadow-md p-8 mt-8">
            <h2 className="text-2xl font-bold text-center mb-6">Rest Time</h2>
            <div className="text-center mb-8">
              <p className="text-6xl font-bold text-blue-600 mb-2">{restTimer}</p>
              <p className="text-gray-600">seconds remaining</p>
            </div>
            {nextExercise && (
              <div className="text-center">
                <p className="text-lg text-gray-600">
                  Set {setNumber} of {setsCount} — Exercise {exerciseNumber} of {baseExercises.length}
                </p>
                <p className="text-xl font-semibold">{nextExercise.name}</p>
              </div>
            )}
            <div className="flex justify-center space-x-4 mt-8">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={() => {
                  completeRest();
                  setRestTimer(20);
                }}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Skip Rest
              </button>
            </div>
          </div>
        ) : (
          // Exercise Screen
          <div className="bg-white rounded-lg shadow-md p-8 mt-8">
            <div className="text-center mb-8">
              <p className="text-lg text-gray-600">
                Set {setNumber} of {setsCount} — Exercise {exerciseNumber} of {baseExercises.length}
              </p>
              <h2 className="text-3xl font-bold mt-2">{currentExercise.name}</h2>
            </div>

            {currentExercise.gifUrl && (
              <div className="flex justify-center mb-8">
                <img
                  src={currentExercise.gifUrl}
                  alt={currentExercise.name}
                  className="max-w-full h-64 object-contain rounded-lg"
                />
              </div>
            )}

            <div className="text-center mb-8">
              <p className="text-6xl font-bold text-blue-600">{currentExercise.duration - timer}</p>
              <p className="text-gray-600 mt-2">seconds remaining</p>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={() => {
                  skipExercise();
                  setTimer(0);
                }}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Skip Exercise
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutSession; 