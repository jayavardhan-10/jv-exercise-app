const mongoose = require('mongoose');
const Exercise = require('../models/exercise');

const exercises = [
  // Strength Exercises
  {
    name: 'Push-ups',
    description: 'A classic bodyweight exercise that targets the chest, shoulders, and triceps',
    category: 'Strength',
    defaultSets: 3,
    defaultReps: 12,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Start in a plank position with hands slightly wider than shoulders',
      'Lower your body until your chest nearly touches the floor',
      'Push your body back up to the starting position',
      'Keep your core tight and body straight throughout the movement'
    ],
    gifUrl: 'https://example.com/pushup.gif' // Replace with actual GIF URL
  },
  {
    name: 'Squats',
    description: 'A fundamental lower body exercise that targets the quadriceps, hamstrings, and glutes',
    category: 'Strength',
    defaultSets: 3,
    defaultReps: 15,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Lower your body by bending your knees and pushing your hips back',
      'Keep your chest up and back straight',
      'Return to standing position by pushing through your heels'
    ],
    gifUrl: 'https://example.com/squat.gif' // Replace with actual GIF URL
  },
  {
    name: 'Lunges',
    description: 'A unilateral exercise that targets the legs and improves balance',
    category: 'Strength',
    defaultSets: 3,
    defaultReps: 10,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Stand with feet together',
      'Step forward with one leg and lower your body',
      'Both knees should be at 90 degrees',
      'Push back to starting position'
    ],
    gifUrl: 'https://example.com/lunge.gif' // Replace with actual GIF URL
  },
  {
    name: 'Dumbbell Rows',
    description: 'A back exercise that targets the lats and improves posture',
    category: 'Strength',
    defaultSets: 3,
    defaultReps: 12,
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    instructions: [
      'Bend at waist with one hand and knee on bench',
      'Hold dumbbell in other hand',
      'Pull dumbbell to hip',
      'Lower with control'
    ],
    gifUrl: 'https://example.com/dumbbell-row.gif' // Replace with actual GIF URL
  },

  // Cardio Exercises
  {
    name: 'Jumping Jacks',
    description: 'A full-body cardio exercise that increases heart rate',
    category: 'Cardio',
    defaultSets: 3,
    defaultReps: 30,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Start standing with feet together',
      'Jump feet apart while raising arms',
      'Jump back to starting position',
      'Repeat at a quick pace'
    ],
    gifUrl: 'https://example.com/jumping-jacks.gif' // Replace with actual GIF URL
  },
  {
    name: 'High Knees',
    description: 'A dynamic cardio exercise that improves coordination and endurance',
    category: 'Cardio',
    defaultSets: 3,
    defaultReps: 30,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Stand in place',
      'Run in place bringing knees up high',
      'Pump arms as if running',
      'Maintain quick pace'
    ],
    gifUrl: 'https://example.com/high-knees.gif' // Replace with actual GIF URL
  },

  // Core Exercises
  {
    name: 'Plank',
    description: 'An isometric core exercise that improves stability',
    category: 'Core',
    defaultSets: 3,
    defaultReps: 1,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Start in push-up position',
      'Bend elbows to 90 degrees',
      'Hold body straight',
      'Engage core muscles'
    ],
    gifUrl: 'https://example.com/plank.gif' // Replace with actual GIF URL
  },
  {
    name: 'Side Planks',
    description: 'A core exercise that targets the obliques',
    category: 'Core',
    defaultSets: 3,
    defaultReps: 1,
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    instructions: [
      'Lie on side',
      'Prop up on forearm',
      'Lift hips off ground',
      'Hold position'
    ],
    gifUrl: 'https://example.com/side-plank.gif' // Replace with actual GIF URL
  },
  {
    name: 'Leg Raises',
    description: 'A core exercise that targets the lower abs',
    category: 'Core',
    defaultSets: 3,
    defaultReps: 12,
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    instructions: [
      'Lie on back',
      'Keep legs straight',
      'Raise legs to 90 degrees',
      'Lower with control'
    ],
    gifUrl: 'https://example.com/leg-raises.gif' // Replace with actual GIF URL
  },
  {
    name: 'Torso Twists',
    description: 'A core exercise that targets the obliques',
    category: 'Core',
    defaultSets: 3,
    defaultReps: 15,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Sit with knees bent',
      'Lean back slightly',
      'Twist torso side to side',
      'Keep core engaged'
    ],
    gifUrl: 'https://example.com/torso-twists.gif' // Replace with actual GIF URL
  },

  // Warmup Exercises
  {
    name: 'Arm Circles',
    description: 'A dynamic warmup for the shoulders',
    category: 'Warmup',
    defaultSets: 2,
    defaultReps: 10,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Stand with arms extended',
      'Make small circles forward',
      'Reverse direction',
      'Gradually increase circle size'
    ],
    gifUrl: 'https://example.com/arm-circles.gif' // Replace with actual GIF URL
  },
  {
    name: 'Dynamic Leg Swings',
    description: 'A dynamic warmup for the hips and legs',
    category: 'Warmup',
    defaultSets: 2,
    defaultReps: 10,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Stand next to wall',
      'Swing leg forward and back',
      'Keep upper body stable',
      'Switch legs'
    ],
    gifUrl: 'https://example.com/leg-swings.gif' // Replace with actual GIF URL
  },
  {
    name: 'Ankle Circles',
    description: 'A warmup for the ankles',
    category: 'Warmup',
    defaultSets: 2,
    defaultReps: 10,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Sit or stand',
      'Rotate ankle clockwise',
      'Reverse direction',
      'Switch feet'
    ],
    gifUrl: 'https://example.com/ankle-circles.gif' // Replace with actual GIF URL
  },
  {
    name: 'Wrist Circles',
    description: 'A warmup for the wrists',
    category: 'Warmup',
    defaultSets: 2,
    defaultReps: 10,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Extend arms forward',
      'Rotate wrists clockwise',
      'Reverse direction',
      'Keep elbows straight'
    ],
    gifUrl: 'https://example.com/wrist-circles.gif' // Replace with actual GIF URL
  },

  // Stretching Exercises
  {
    name: 'Standing Hamstring Stretch',
    description: 'A stretch for the back of the thighs',
    category: 'Stretching',
    defaultSets: 2,
    defaultReps: 1,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Stand with feet together',
      'Bend forward at hips',
      'Keep knees slightly bent',
      'Hold stretch'
    ],
    gifUrl: 'https://example.com/hamstring-stretch.gif' // Replace with actual GIF URL
  },
  {
    name: 'Calf Stretch',
    description: 'A stretch for the lower legs',
    category: 'Stretching',
    defaultSets: 2,
    defaultReps: 1,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Stand facing wall',
      'Step one foot back',
      'Keep back heel down',
      'Lean forward'
    ],
    gifUrl: 'https://example.com/calf-stretch.gif' // Replace with actual GIF URL
  },
  {
    name: 'Seated Forward Bend',
    description: 'A stretch for the back and hamstrings',
    category: 'Stretching',
    defaultSets: 2,
    defaultReps: 1,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Sit with legs extended',
      'Reach forward',
      'Keep back straight',
      'Hold stretch'
    ],
    gifUrl: 'https://example.com/forward-bend.gif' // Replace with actual GIF URL
  },
  {
    name: 'Cobra Stretch',
    description: 'A stretch for the chest and abdomen',
    category: 'Stretching',
    defaultSets: 2,
    defaultReps: 1,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Lie face down',
      'Place hands under shoulders',
      'Push upper body up',
      'Keep hips down'
    ],
    gifUrl: 'https://example.com/cobra-stretch.gif' // Replace with actual GIF URL
  },
  {
    name: 'Child\'s Pose',
    description: 'A relaxing stretch for the back',
    category: 'Stretching',
    defaultSets: 2,
    defaultReps: 1,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Kneel on floor',
      'Sit back on heels',
      'Fold forward',
      'Extend arms'
    ],
    gifUrl: 'https://example.com/childs-pose.gif' // Replace with actual GIF URL
  },
  {
    name: 'Neck Rolls',
    description: 'A stretch for the neck',
    category: 'Stretching',
    defaultSets: 2,
    defaultReps: 5,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Stand or sit straight',
      'Roll head clockwise',
      'Reverse direction',
      'Move slowly'
    ],
    gifUrl: 'https://example.com/neck-rolls.gif' // Replace with actual GIF URL
  },
  {
    name: 'Shoulder Rolls',
    description: 'A stretch for the shoulders',
    category: 'Stretching',
    defaultSets: 2,
    defaultReps: 5,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Stand straight',
      'Roll shoulders forward',
      'Reverse direction',
      'Keep arms relaxed'
    ],
    gifUrl: 'https://example.com/shoulder-rolls.gif' // Replace with actual GIF URL
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