const mongoose = require('mongoose');
const Exercise = require('../models/exercise');

const exercises = [
  {
    name: 'Push-Up',
    description: 'A classic upper body exercise that targets chest, shoulders, and triceps.',
    category: 'Push',
    defaultSets: 3,
    defaultReps: 12,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Start in a plank position with hands slightly wider than shoulders',
      'Keep your body in a straight line from head to heels',
      'Lower your body until your chest nearly touches the ground',
      'Push back up to the starting position',
      'Repeat for desired reps'
    ],
    gifUrl: 'https://media.giphy.com/media/XreQmk7ETCak0/giphy.gif'
  },
  {
    name: 'Bodyweight Squat',
    description: 'A fundamental lower body exercise targeting quadriceps, hamstrings, and glutes.',
    category: 'Legs',
    defaultSets: 3,
    defaultReps: 15,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Keep your chest up and core engaged',
      'Lower your body by bending your knees and hips',
      'Keep your weight in your heels',
      'Return to standing position'
    ],
    gifUrl: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif'
  },
  {
    name: 'Plank',
    description: 'An isometric core exercise that builds stability and strength.',
    category: 'Core',
    defaultSets: 3,
    defaultReps: 1,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Start in a forearm plank position',
      'Keep your body in a straight line',
      'Engage your core and glutes',
      'Hold the position',
      'Maintain proper breathing'
    ],
    gifUrl: 'https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif'
  },
  {
    name: 'Dumbbell Bicep Curl',
    description: 'An isolation exercise targeting the biceps muscles.',
    category: 'Pull',
    defaultSets: 3,
    defaultReps: 12,
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Stand with dumbbells in hand, palms facing forward',
      'Keep your upper arms stationary',
      'Curl the weights up towards your shoulders',
      'Lower the weights back down with control',
      'Repeat for desired reps'
    ],
    gifUrl: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif'
  },
  {
    name: 'Jumping Jacks',
    description: 'A full-body cardio exercise that raises heart rate and improves coordination.',
    category: 'Cardio',
    defaultSets: 3,
    defaultReps: 30,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Start standing with feet together and arms at sides',
      'Jump and spread legs while raising arms overhead',
      'Jump back to starting position',
      'Maintain a steady rhythm',
      'Keep breathing steady'
    ],
    gifUrl: 'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif'
  }
];

const seedExercises = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/exerciseApp', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Successfully connected to MongoDB');

    // Clear existing exercises
    console.log('Clearing existing exercises...');
    const deleteResult = await Exercise.deleteMany({});
    console.log('Cleared existing exercises:', deleteResult);

    // Insert new exercises
    console.log('Inserting new exercises...');
    const insertResult = await Exercise.insertMany(exercises);
    console.log('Successfully seeded exercises:', insertResult);

    // Verify the exercises were inserted
    const count = await Exercise.countDocuments();
    console.log(`Total exercises in database: ${count}`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

  } catch (error) {
    console.error('Error seeding exercises:', error);
    process.exit(1);
  }
};

// Run the seed function
seedExercises(); 