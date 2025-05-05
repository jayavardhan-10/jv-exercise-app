import React, { useState, useEffect } from 'react';
import { exerciseService } from '../services/exerciseService';

const ExerciseLibrary = ({ onExerciseSelect, isSelectionMode = false }) => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Strength', 'Cardio', 'Core', 'Warmup', 'Stretching'];

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      console.log('Fetching exercises...');
      const data = await exerciseService.getAllExercises();
      console.log('Received exercises:', data);
      setExercises(data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading exercises:', err);
      setError('Failed to load exercises');
      setLoading(false);
    }
  };

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div className="text-center p-4">Loading exercises...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Search and Filter Section */}
      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Search exercises..."
          className="w-full p-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map(exercise => (
          <div
            key={exercise._id}
            className={`border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${
              isSelectionMode ? 'cursor-pointer' : ''
            }`}
            onClick={() => isSelectionMode && onExerciseSelect(exercise)}
          >
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={exercise.gifUrl}
                alt={exercise.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{exercise.name}</h3>
              <p className="text-gray-600 mb-2">{exercise.description}</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {exercise.category}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  {exercise.equipment}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {exercise.difficulty}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Default: {exercise.defaultSets} sets × {exercise.defaultReps} reps
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseLibrary; 