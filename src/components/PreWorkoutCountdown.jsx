import React, { useState, useEffect } from 'react';

const PreWorkoutCountdown = ({ onCountdownComplete, firstExercise }) => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      onCountdownComplete();
    }
  }, [countdown, onCountdownComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-6">Ready to Go!</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">First Exercise:</h2>
          <p className="text-2xl text-blue-600">{firstExercise}</p>
        </div>

        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-gray-200"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
              <circle
                className="text-blue-600"
                strokeWidth="8"
                strokeDasharray={`${(countdown / 10) * 251.2} 251.2`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
            </svg>
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold">
              {countdown}
            </span>
          </div>
        </div>

        {/* Skip Button */}
        <button
          onClick={onCountdownComplete}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Skip Countdown
        </button>
      </div>
    </div>
  );
};

export default PreWorkoutCountdown; 