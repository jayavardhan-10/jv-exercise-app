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
    exitWorkout,
  } = useWorkout();

  const [isPaused, setIsPaused] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Calculate progress: Already completed (current) exercise should be counted
  const setsCount = currentWorkout?.sets || 1;
  const baseExercises = currentWorkout?.exercises || [];
  const totalExercises = setsCount * baseExercises.length;
  
  console.log('Rest Screen - Sets Count:', setsCount);
  console.log('Rest Screen - Base Exercises:', baseExercises);
  console.log('Rest Screen - Current Exercise Index:', currentExerciseIndex);
  console.log('Rest Screen - Total Exercises:', totalExercises);
  
  // During rest, the current exercise is already completed, so include it in progress
  const progress = ((currentExerciseIndex + 1) / totalExercises) * 100;

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

  const handleExit = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    exitWorkout();
  };

  const cancelExit = () => {
    setShowExitConfirm(false);
  };

  const handleSkipRest = () => {
    // Safely handle skip rest - ensure we're not going beyond total exercises
    if (currentExerciseIndex + 1 < totalExercises) {
      skipRest();
    } else {
      // If at the last exercise, complete the workout
      exitWorkout();
    }
  };

  // Calculate which set and exercise we're on
  const currentSet = Math.floor((currentExerciseIndex + 1) / baseExercises.length) + 1;
  const nextExerciseInSet = (currentExerciseIndex + 1) % baseExercises.length;

  // Get the next exercise
  const nextExercise = currentExerciseIndex + 1 < totalExercises && baseExercises.length > 0 
    ? baseExercises[nextExerciseInSet] 
    : null;
    
  console.log('Rest Screen - Current Set:', currentSet);
  console.log('Rest Screen - Next Exercise In Set:', nextExerciseInSet);
  console.log('Rest Screen - Next Exercise:', nextExercise);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Progress Bar - improved appearance */}
      <div className="w-full h-4 bg-gray-200 mb-4 mt-1">
        <div
          className="h-full bg-blue-600 transition-all duration-700 rounded-r"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="max-w-2xl mx-auto pt-1 px-3 sm:px-4">
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
            <p className="text-lg text-blue-600">{nextExercise ? nextExercise.name : 'Workout Complete!'}</p>
            {nextExercise && (
              <>
                <p className="text-gray-600">Set {currentSet} of {setsCount} — Exercise {nextExerciseInSet + 1} of {baseExercises.length}</p>
                {nextExercise.useDuration ? (
                  <p className="text-gray-600">Duration: {formatTime(nextExercise.duration)}</p>
                ) : (
                  <p className="text-gray-600">Reps: {nextExercise.reps || 0}</p>
                )}
              </>
            )}
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
              onClick={handleSkipRest}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Skip Rest
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

export default RestScreen; 