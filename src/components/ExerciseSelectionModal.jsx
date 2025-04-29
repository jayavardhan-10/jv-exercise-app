import React from 'react';
import ExerciseLibrary from './ExerciseLibrary';

const ExerciseSelectionModal = ({ isOpen, onClose, onExerciseSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">Select Exercise</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        
        <div className="p-4">
          <ExerciseLibrary
            isSelectionMode={true}
            onExerciseSelect={(exercise) => {
              onExerciseSelect(exercise);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ExerciseSelectionModal; 