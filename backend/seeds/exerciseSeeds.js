const mongoose = require('mongoose');
const Exercise = require('../models/exercise');

const exercises = [
  {
    name: 'Push-Ups',
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
    name: 'Squats',
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
  },
  {
    name: 'Arm Circles',
    description: 'A dynamic warm-up exercise for shoulder mobility and flexibility.',
    category: 'Warm-up',
    defaultSets: 2,
    defaultReps: 10,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Extend arms straight out to sides at shoulder height',
      'Make small circles with your arms',
      'After 10 reps, reverse direction',
      'Keep movements controlled and smooth'
    ],
    gifUrl: 'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif'
  },
  {
    name: 'Dynamic Leg Swings',
    description: 'A dynamic warm-up exercise to improve hip mobility and flexibility.',
    category: 'Warm-up',
    defaultSets: 2,
    defaultReps: 10,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Stand next to a wall or support',
      'Swing one leg forward and backward',
      'Keep the movement controlled',
      'Switch legs after 10 reps',
      'Maintain upright posture'
    ],
    gifUrl: 'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif'
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
    name: 'Side Plank',
    description: 'A core exercise that targets the obliques and improves stability.',
    category: 'Core',
    defaultSets: 2,
    defaultReps: 1,
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    instructions: [
      'Lie on your side with legs straight',
      'Prop yourself up on your forearm',
      'Lift your hips off the ground',
      'Keep your body in a straight line',
      'Hold the position'
    ],
    gifUrl: 'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif'
  },
  {
    name: 'Lunges',
    description: 'A lower body exercise that targets quadriceps, hamstrings, and glutes.',
    category: 'Legs',
    defaultSets: 3,
    defaultReps: 10,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Stand with feet hip-width apart',
      'Step forward with one leg',
      'Lower your body until both knees are at 90 degrees',
      'Push back to starting position',
      'Alternate legs'
    ],
    gifUrl: 'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif'
  },
  {
    name: 'Leg Raises',
    description: 'A core exercise that targets the lower abs and hip flexors.',
    category: 'Core',
    defaultSets: 3,
    defaultReps: 12,
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    instructions: [
      'Lie flat on your back',
      'Keep legs straight and together',
      'Lift legs up to 90 degrees',
      'Lower legs back down with control',
      'Keep lower back pressed to the floor'
    ],
    gifUrl: 'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif'
  },
  {
    name: 'High Knees',
    description: 'A cardio exercise that improves coordination and raises heart rate.',
    category: 'Cardio',
    defaultSets: 3,
    defaultReps: 30,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Stand with feet hip-width apart',
      'Lift one knee up to hip height',
      'Quickly switch to the other knee',
      'Pump your arms as you run',
      'Maintain a quick pace'
    ],
    gifUrl: 'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif'
  },
  {
    name: 'Dumbbell Rows',
    description: 'A back exercise that targets the lats, rhomboids, and biceps.',
    category: 'Pull',
    defaultSets: 3,
    defaultReps: 12,
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Bend forward at the hips',
      'Keep back straight and core engaged',
      'Pull dumbbells up to your waist',
      'Squeeze shoulder blades together',
      'Lower weights with control'
    ],
    gifUrl: 'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif'
  },
  {
    name: 'Standing Leg Swings',
    description: 'A dynamic warm-up exercise for hip mobility.',
    category: 'Warm-up',
    defaultSets: 2,
    defaultReps: 10,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Stand next to a wall for support',
      'Swing one leg side to side',
      'Keep the movement controlled',
      'Switch legs after 10 reps',
      'Maintain upright posture'
    ],
    gifUrl: 'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif'
  },
  {
    name: 'Torso Twists',
    description: 'A warm-up exercise to improve spinal mobility.',
    category: 'Warm-up',
    defaultSets: 2,
    defaultReps: 10,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Keep arms extended at shoulder height',
      'Rotate torso from side to side',
      'Keep hips facing forward',
      'Move in a controlled manner'
    ],
    gifUrl: 'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif'
  },
  {
    name: 'Ankle Circles',
    description: 'A warm-up exercise to improve ankle mobility.',
    category: 'Warm-up',
    defaultSets: 2,
    defaultReps: 10,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Sit or stand with one leg lifted',
      'Rotate ankle in circular motion',
      'Make 10 circles in each direction',
      'Switch to other ankle',
      'Keep movements controlled'
    ],
    gifUrl: 'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif'
  },
  {
    name: 'Wrist Circles',
    description: 'A warm-up exercise to improve wrist mobility.',
    category: 'Warm-up',
    defaultSets: 2,
    defaultReps: 10,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Extend arms in front of you',
      'Make circles with your wrists',
      'Rotate in both directions',
      'Keep movements controlled',
      'Maintain proper breathing'
    ],
    gifUrl: 'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif'
  },
  {
    name: 'Standing Hamstring Stretch',
    description: 'A static stretch for the hamstrings.',
    category: 'Stretch',
    defaultSets: 2,
    defaultReps: 1,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Stand with feet hip-width apart',
      'Extend one leg forward',
      'Hinge at hips to reach toward toes',
      'Keep back straight',
      'Hold for 20-30 seconds'
    ],
    gifUrl: 'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif'
  },
  {
    name: 'Calf Stretch',
    description: 'A static stretch for the calf muscles.',
    category: 'Stretch',
    defaultSets: 2,
    defaultReps: 1,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Stand facing a wall',
      'Place hands on wall at shoulder height',
      'Step one foot back',
      'Keep back leg straight',
      'Hold for 20-30 seconds'
    ],
    gifUrl: 'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif'
  },
  {
    name: 'Seated Forward Bend',
    description: 'A static stretch for the hamstrings and lower back.',
    category: 'Stretch',
    defaultSets: 2,
    defaultReps: 1,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Sit with legs extended straight',
      'Reach forward toward toes',
      'Keep back straight',
      'Hold for 20-30 seconds',
      'Breathe deeply'
    ],
    gifUrl: 'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif'
  },
  {
    name: 'Cobra Stretch',
    description: 'A static stretch for the abs and chest.',
    category: 'Stretch',
    defaultSets: 2,
    defaultReps: 1,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Lie on your stomach',
      'Place hands under shoulders',
      'Press up to lift chest',
      'Keep hips on ground',
      'Hold for 20-30 seconds'
    ],
    gifUrl: 'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif'
  },
  {
    name: 'Child\'s Pose',
    description: 'A relaxing stretch for the back and hips.',
    category: 'Stretch',
    defaultSets: 2,
    defaultReps: 1,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Kneel on the floor',
      'Sit back on heels',
      'Fold forward with arms extended',
      'Rest forehead on ground',
      'Hold for 20-30 seconds'
    ],
    gifUrl: 'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif'
  },
  {
    name: 'Neck Rolls',
    description: 'A gentle stretch for the neck muscles.',
    category: 'Stretch',
    defaultSets: 2,
    defaultReps: 5,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Sit or stand with good posture',
      'Slowly roll head in circular motion',
      'Make 5 circles in each direction',
      'Keep movements controlled',
      'Breathe deeply'
    ],
    gifUrl: 'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif'
  },
  {
    name: 'Shoulder Rolls',
    description: 'A gentle stretch for the shoulder muscles.',
    category: 'Stretch',
    defaultSets: 2,
    defaultReps: 10,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Stand with good posture',
      'Roll shoulders in circular motion',
      'Make 10 circles in each direction',
      'Keep movements controlled',
      'Breathe deeply'
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