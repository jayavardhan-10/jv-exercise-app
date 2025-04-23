import React from 'react';
import { useWorkout } from '../context/WorkoutContext';

const WorkoutPlanDashboard = ({ onStartWorkout, onNavigate }) => {
  const { workouts, deleteWorkout, mockWorkout } = useWorkout();

  // Calculate total duration including rest periods
  const calculateWorkoutDuration = (exercises) => {
    if (!exercises) return 0;
    const exerciseTime = exercises.reduce((total, exercise) => total + exercise.duration, 0);
    const restTime = (exercises.length - 1) * 20; // 20 seconds rest between exercises
    return exerciseTime + restTime;
  };

  const formatDuration = (totalSeconds) => {
    const minutes = Math.ceil(totalSeconds / 60);
    return `${minutes} min`;
  };

  // Weekly schedule
  const workoutDays = [
    { id: 1, name: 'Sunday', exercises: mockWorkout.exercises, isRestDay: false, completed: false },
    { id: 2, name: 'Monday', exercises: mockWorkout.exercises, isRestDay: false, completed: false },
    { id: 3, name: 'Tuesday', exercises: mockWorkout.exercises, isRestDay: false, completed: false },
    { id: 4, name: 'Wednesday', isRestDay: true, completed: false },
    { id: 5, name: 'Thursday', exercises: mockWorkout.exercises, isRestDay: false, completed: false },
    { id: 6, name: 'Friday', exercises: mockWorkout.exercises, isRestDay: false, completed: false },
    { id: 7, name: 'Saturday', exercises: mockWorkout.exercises, isRestDay: false, completed: false },
  ];

  const handleDayClick = (day) => {
    if (!day.isRestDay) {
      onStartWorkout(mockWorkout.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Create Button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Weekly Workout Plan</h1>
          <button
            onClick={() => onNavigate('create')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Workout
          </button>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Overall Progress</h2>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="bg-blue-600 h-4 rounded-full" style={{ width: '0%' }}></div>
          </div>
          <p className="text-center mt-2">0% Complete</p>
        </div>

        {/* Weekly Schedule */}
        <h2 className="text-2xl font-semibold mb-4">Weekly Schedule</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {workoutDays.map((day) => (
            <div
              key={day.id}
              onClick={() => handleDayClick(day)}
              className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-transform hover:scale-105 ${
                day.isRestDay ? 'border-2 border-yellow-400 bg-yellow-50' : 'hover:shadow-lg'
              } ${!day.isRestDay && 'hover:border-blue-400 border-2 border-transparent'}`}
            >
              <h3 className="text-xl font-semibold mb-2">{day.name}</h3>
              <p className={`mb-4 ${day.isRestDay ? 'text-yellow-600' : 'text-gray-600'}`}>
                {day.isRestDay ? 'Rest Day' : formatDuration(calculateWorkoutDuration(day.exercises))}
              </p>
              {day.completed && (
                <div className="text-green-500">
                  <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              {!day.isRestDay && !day.completed && (
                <p className="text-blue-600 text-sm text-center mt-2">Click to start workout</p>
              )}
              {day.isRestDay && (
                <p className="text-yellow-600 text-sm text-center mt-2">Rest & Recovery</p>
              )}
            </div>
          ))}
        </div>

        {/* Custom Workouts */}
        {workouts.length > 1 && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Custom Workouts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workouts.filter(w => w.id !== mockWorkout.id).map((workout) => (
                <div
                  key={workout.id}
                  className="bg-white rounded-lg shadow-md p-6 relative group"
                >
                  <button
                    onClick={() => deleteWorkout(workout.id)}
                    className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  <h3 className="text-xl font-semibold mb-2">{workout.name}</h3>
                  <div className="text-gray-600 mb-4">
                    <p>{workout.exercises.length} exercises</p>
                    <p>{formatDuration(calculateWorkoutDuration(workout.exercises))}</p>
                  </div>

                  <button
                    onClick={() => onStartWorkout(workout.id)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start Workout
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlanDashboard; 