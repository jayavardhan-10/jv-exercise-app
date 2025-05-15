import React, { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal';

const WorkoutPlanDashboard = () => {
  const navigate = useNavigate();
  const { workouts, deleteWorkout, startWorkout } = useWorkout();
  const [workoutToDelete, setWorkoutToDelete] = useState(null);

  // Default workout template
  const defaultWorkout = {
    id: 'default',
    name: 'Default Workout',
    exercises: [
      { id: 1, name: 'Push-ups', duration: 30 },
      { id: 2, name: 'Squats', duration: 30 },
      { id: 3, name: 'Plank', duration: 30 },
    ]
  };

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

  const handleDeleteClick = (e, workout) => {
    e.stopPropagation();
    setWorkoutToDelete(workout);
  };

  const confirmDelete = () => {
    if (workoutToDelete) {
      deleteWorkout(workoutToDelete.id);
      setWorkoutToDelete(null);
    }
  };

  const cancelDelete = () => {
    setWorkoutToDelete(null);
  };

  const handleStartWorkout = (workoutId) => {
    let workoutToStart;
    
    // Check if it's a custom workout
    if (workouts) {
      workoutToStart = workouts.find(w => w.id === workoutId);
    }
    
    // If not found in custom workouts, check if it's a daily workout
    if (!workoutToStart) {
      const dayWorkout = workoutDays.find(d => d.id === workoutId);
      if (dayWorkout && !dayWorkout.isRestDay) {
        workoutToStart = {
          ...defaultWorkout,
          id: workoutId,
          name: `${dayWorkout.name}'s Workout`
        };
      }
    }

    if (workoutToStart) {
      startWorkout(workoutToStart);
      navigate('/workout');
    }
  };

  // Weekly schedule with default workout
  const workoutDays = [
    { id: 'sunday', name: 'Sunday', exercises: defaultWorkout.exercises, isRestDay: false, completed: false },
    { id: 'monday', name: 'Monday', exercises: defaultWorkout.exercises, isRestDay: false, completed: false },
    { id: 'tuesday', name: 'Tuesday', exercises: defaultWorkout.exercises, isRestDay: false, completed: false },
    { id: 'wednesday', name: 'Wednesday', isRestDay: true, completed: false },
    { id: 'thursday', name: 'Thursday', exercises: defaultWorkout.exercises, isRestDay: false, completed: false },
    { id: 'friday', name: 'Friday', exercises: defaultWorkout.exercises, isRestDay: false, completed: false },
    { id: 'saturday', name: 'Saturday', isRestDay: true, completed: false },
  ];

  // Default practical workouts
  const defaultWorkouts = [
    {
      id: 'legs',
      name: 'Legs Blast',
      duration: 12,
      exercises: [
        { name: 'Squats', duration: 60 },
        { name: 'Lunges', duration: 60 },
        { name: 'Glute Bridge', duration: 60 },
        { name: 'Wall Sit', duration: 60 },
        { name: 'Calf Raises', duration: 60 },
      ],
    },
    {
      id: 'arms',
      name: 'Arms Power',
      duration: 10,
      exercises: [
        { name: 'Push-ups', duration: 45 },
        { name: 'Tricep Dips', duration: 45 },
        { name: 'Plank Up-Downs', duration: 45 },
        { name: 'Diamond Push-ups', duration: 45 },
      ],
    },
    {
      id: 'abs',
      name: 'Abs Core',
      duration: 12,
      exercises: [
        { name: 'Crunches', duration: 45 },
        { name: 'Russian Twist', duration: 45 },
        { name: 'Bicycle Crunches', duration: 45 },
        { name: 'Leg Raises', duration: 45 },
        { name: 'Plank', duration: 60 },
      ],
    },
    {
      id: 'chest',
      name: 'Chest Builder',
      duration: 10,
      exercises: [
        { name: 'Push-ups', duration: 45 },
        { name: 'Wide Push-ups', duration: 45 },
        { name: 'Decline Push-ups', duration: 45 },
        { name: 'Chest Dips', duration: 45 },
      ],
    },
    {
      id: 'shoulders',
      name: 'Shoulder Strength',
      duration: 10,
      exercises: [
        { name: 'Pike Push-ups', duration: 45 },
        { name: 'Plank to Downward Dog', duration: 45 },
        { name: 'Arm Circles', duration: 60 },
        { name: 'Shoulder Taps', duration: 45 },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Create Button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Workout Library</h1>
          <button
            onClick={() => navigate('/create')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Workout
          </button>
        </div>

        {/* General Workouts */}
        <h2 className="text-2xl font-semibold mb-4">General Workouts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {defaultWorkouts.map((workout) => (
            <div
              key={workout.id}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition-transform hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-blue-400 flex flex-col justify-between"
              onClick={() => {
                startWorkout({
                  id: workout.id,
                  name: workout.name,
                  exercises: workout.exercises,
                  sets: 1,
                });
                navigate('/workout');
              }}
            >
              <h3 className="text-xl font-semibold mb-2">{workout.name}</h3>
              <div className="text-gray-600 mb-4">
                <p>{workout.exercises.length} exercises</p>
                <p>{workout.duration} min</p>
              </div>
              <button
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={e => {
                  e.stopPropagation();
                  startWorkout({
                    id: workout.id,
                    name: workout.name,
                    exercises: workout.exercises,
                    sets: 1,
                  });
                  navigate('/workout');
                }}
              >
                Start Workout
              </button>
            </div>
          ))}
        </div>

        {/* Custom Workouts */}
        {workouts && workouts.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Custom Workouts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workouts.map((workout) => (
                <div
                  key={workout.id}
                  className="bg-white rounded-lg shadow-md p-6 relative group transition-transform hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-blue-400 flex flex-col justify-between"
                >
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/edit', { state: { workout } });
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600"
                      title="Edit workout"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(e, workout)}
                      className="p-2 text-gray-400 hover:text-red-600"
                      title="Delete workout"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{workout.name}</h3>
                  <div className="text-gray-600 mb-4">
                    <p>{workout.exercises?.length || 0} exercises</p>
                    <p>{formatDuration(calculateWorkoutDuration(workout.exercises))}</p>
                  </div>

                  <button
                    onClick={() => handleStartWorkout(workout.id)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start Workout
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={!!workoutToDelete}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Delete Workout?"
          message={`Are you sure you want to delete "${workoutToDelete?.name}"? This action cannot be undone.`}
        />
      </div>
    </div>
  );
};

export default WorkoutPlanDashboard; 