import React from 'react';
import { useWorkout } from '../context/WorkoutContext';

const WorkoutPlanDashboard = ({ onStartWorkout }) => {
  const { mockWorkout } = useWorkout();

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

  // Updated workout days for the full week
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
      onStartWorkout(day.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Weekly Workout Plan</h1>
        
        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Overall Progress</h2>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="bg-blue-600 h-4 rounded-full" style={{ width: '0%' }}></div>
          </div>
          <p className="text-center mt-2">0% Complete</p>
        </div>

        {/* Workout Days Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      </div>
    </div>
  );
};

export default WorkoutPlanDashboard; 