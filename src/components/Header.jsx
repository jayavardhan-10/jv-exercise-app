import React from 'react';
import { useAuth } from '../context/AuthContext';

const Header = ({ streakCount = 0, onStreakClick }) => {
  const { user } = useAuth();

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-20">
      <div className="text-2xl font-bold text-gray-900">JV Exercise App</div>
      <div className="flex items-center gap-6">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-600 font-semibold shadow transition-all"
          onClick={onStreakClick}
        >
          <span role="img" aria-label="streak">🔥</span>
          <span>{streakCount}-day streak</span>
        </button>
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-700 border border-gray-300">
          {user?.displayName?.[0]?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
};

export default Header; 