import React, { useState, useEffect, useCallback } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { useNavigate } from 'react-router-dom';

const ExerciseExecutionScreen = () => {
  const navigate = useNavigate();
  const {
    currentWorkout,
    currentExerciseIndex,
    completeExercise,
    skipExercise,
    previousExercise,
    exitWorkout,
  } = useWorkout();

  // First, declare all state variables
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Safety check - if no current workout, redirect to dashboard
  useEffect(() => {
    if (!currentWorkout) {
      navigate('/dashboard');
    }
  }, [currentWorkout, navigate]);

  // Add detailed debugging logs
  console.log('Current Workout:', currentWorkout);
  console.log('Current Exercise Index:', currentExerciseIndex);

  // Calculate the proper exercise from the flattened list
  const setsCount = currentWorkout?.sets || 1;
  const baseExercises = currentWorkout?.exercises || [];
  
  // Handle multiple sets - calculate which exercise in which set we're on
  const currentSet = Math.floor(currentExerciseIndex / baseExercises.length) + 1;
  const exerciseInSet = currentExerciseIndex % baseExercises.length;
  
  console.log('Sets Count:', setsCount);
  console.log('Base Exercises:', baseExercises);
  console.log('Current Set:', currentSet);
  console.log('Exercise in Set:', exerciseInSet);
  
  // Get the current exercise (accounting for multiple sets)
  const exercise = baseExercises.length > 0 ? baseExercises[exerciseInSet] : null;
  console.log('Current Exercise:', exercise);

  // Total number of exercises across all sets  
  const totalExercises = setsCount * baseExercises.length;
  
  // If no exercise is available, show fallback UI
  if (!exercise) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Exercise not found</h2>
          <p className="mb-6">There was a problem loading the exercise.</p>
          <button
            onClick={exitWorkout}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  // Calculate progress values
  const currentProgress = currentExerciseIndex / totalExercises * 100;
  const nextProgress = (currentExerciseIndex + 1) / totalExercises * 100;
  
  // Now we can safely use exercise and elapsedTime
  const isExerciseComplete = exercise?.useDuration ? elapsedTime >= exercise.duration - 1 : false;
  const progress = isExerciseComplete ? nextProgress : currentProgress;
  
  // Define handleComplete function using useCallback to avoid dependency issues
  const handleComplete = useCallback(() => {
    // Update progress immediately for visual feedback before calling completeExercise
    const progressBar = document.querySelector('.progress-bar-fill');
    if (progressBar) {
      progressBar.style.width = `${nextProgress}%`;
    }
    
    // Short delay for visual effect before completing exercise
    setTimeout(() => {
      completeExercise();
    }, 300);
  }, [completeExercise, nextProgress]);

  // Timer logic
  useEffect(() => {
    let timer;
    if (!isPaused && exercise) {
      if (exercise.useDuration) {
        // Countdown
        if (elapsedTime < exercise.duration) {
          timer = setInterval(() => {
            setElapsedTime(prev => prev + 1);
          }, 1000);
        } else {
          // Auto-advance when time is up, with immediate progress update
          handleComplete();
        }
      } else {
        // Count up
        timer = setInterval(() => {
          setElapsedTime(prev => prev + 1);
        }, 1000);
      }
    }
    return () => clearInterval(timer);
  }, [isPaused, elapsedTime, exercise, handleComplete]);

  // Reset timer when exercise changes
  useEffect(() => {
    setElapsedTime(0);
    setIsPaused(false);
  }, [exercise, currentExerciseIndex]);

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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Progress Bar - improved appearance */}
      <div className="w-full h-4 bg-gray-200 mb-4 mt-1">
        <div
          className="progress-bar-fill h-full bg-blue-600 transition-all duration-700 rounded-r"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="max-w-2xl mx-auto w-full pt-1 px-3 sm:px-4">
        {/* Exit Button */}
        <div className="flex justify-end mb-2 sm:mb-4">
          <button
            onClick={handleExit}
            className="bg-red-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center text-sm sm:text-base"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Exit Workout
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 mb-3 sm:mb-4 transition-all duration-300">
          <p className="text-center text-base sm:text-lg">
            Set {currentSet} of {setsCount} — Exercise {exerciseInSet + 1} of {baseExercises.length}
          </p>
        </div>

        {/* Exercise Info */}
        <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6 mb-4 sm:mb-6 transition-all duration-300">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-3 sm:mb-4">{exercise.name}</h1>
          
          <div className="flex justify-center mb-6 sm:mb-8">
            {exercise.gifUrl ? (
              <img
                src={exercise.gifUrl}
                alt={exercise.name}
                className="w-32 h-32 sm:w-64 sm:h-64 object-contain rounded-lg shadow transition-all duration-300"
              />
            ) : (
              <div className="bg-gray-100 w-32 h-32 sm:w-64 sm:h-64 flex items-center justify-center rounded-lg">
                <p className="text-gray-500">No animation available</p>
              </div>
            )}
          </div>

          <div className="text-center mb-6 sm:mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Target</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">
                  {exercise.useDuration ? `${exercise.duration} sec` : `${exercise.reps || 0} reps`}
                </p>
                <p className="text-sm text-gray-600">{exercise.useDuration ? 'Duration' : 'Reps'}</p>
              </div>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Time</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-600">
                  {exercise.useDuration ? formatTime(Math.max(0, exercise.duration - elapsedTime)) : formatTime(elapsedTime)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
            <button
              onClick={previousExercise}
              disabled={currentExerciseIndex === 0}
              className={`px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                currentExerciseIndex === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            {!exercise.useDuration && (
              <button
                onClick={handleComplete}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
              >
                Done
              </button>
            )}
            <button
              onClick={skipExercise}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
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