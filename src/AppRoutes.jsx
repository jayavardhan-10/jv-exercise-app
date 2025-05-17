import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import WorkoutPlanDashboard from './components/WorkoutPlanDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Workout from './components/Workout';
import CreateWorkout from './components/CreateWorkout';
import EditWorkout from './components/EditWorkout';
import WorkoutHistory from './components/WorkoutHistory';

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <WorkoutPlanDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/workout"
      element={
        <ProtectedRoute>
          <Workout />
        </ProtectedRoute>
      }
    />
    <Route
      path="/create"
      element={
        <ProtectedRoute>
          <CreateWorkout />
        </ProtectedRoute>
      }
    />
    <Route
      path="/edit"
      element={
        <ProtectedRoute>
          <EditWorkout />
        </ProtectedRoute>
      }
    />
    <Route path="/history" element={<WorkoutHistory />} />
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default AppRoutes; 