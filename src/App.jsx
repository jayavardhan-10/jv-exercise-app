import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WorkoutProvider } from './context/WorkoutContext';
import { WorkoutHistoryProvider } from './context/WorkoutHistoryContext';
import AppRoutes from './AppRoutes';
import Header from './components/Header';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <WorkoutProvider>
          <WorkoutHistoryProvider>
            <div className="min-h-screen bg-gray-100">
              <Header />
              <main className="container mx-auto px-4 py-8">
                <AppRoutes />
              </main>
            </div>
          </WorkoutHistoryProvider>
        </WorkoutProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
