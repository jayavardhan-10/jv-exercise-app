const mongoose = require('mongoose');
const Exercise = require('../models/exercise');

const exercises = [
  // Strength Exercises
  {
    name: 'Push-ups',
    description: 'A basic push-up exercise.',
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
    gifUrl: 'https://i.pinimg.com/originals/2b/b7/14/2bb714fc4307d33df93cf62d56f486b2.gif'
  },
  {
    name: 'Squats',
    description: 'A basic squat exercise.',
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
    gifUrl: 'https://i.pinimg.com/originals/39/9b/a2/399ba209e9e93331e9ff62371b5de6fa.gif'
  },
  {
    name: 'Lunges',
    description: 'A basic lunge exercise.',
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
    gifUrl: 'https://i.pinimg.com/originals/cc/9a/a1/cc9aa14ccea120ac053e1c6450768325.gif'
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
    gifUrl: 'https://i.pinimg.com/originals/df/4a/e2/df4ae262ebf58c803d8daa6cf497fa7c.gif'
  },
  {
    name: 'Decline Pushups',
    description: 'A more challenging variation of the push-up that targets upper chest',
    category: 'Strength',
    defaultSets: 3,
    defaultReps: 10,
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    instructions: [
      'Place your feet on an elevated surface',
      'Position hands on the floor slightly wider than shoulders',
      'Lower chest toward the floor',
      'Push back up to starting position'
    ],
    gifUrl: 'https://i.pinimg.com/originals/9e/42/c1/9e42c1387fc6c446770790753b3890a8.gif'
  },

  // Cardio Exercises
  {
    name: 'Jumping Jacks',
    description: 'A basic jumping jack exercise.',
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
    gifUrl: 'https://assets-v2.lottiefiles.com/a/8c2969a2-116a-11ee-ae24-8ba0ad01121d/SvaCaM18NR.gif'
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
      'Run in place bringing knees up high',
      'Pump arms as if running',
      'Keep core engaged',
      'Maintain quick pace'
    ],
    gifUrl: 'https://i.pinimg.com/originals/aa/7d/6a/aa7d6ab4ac2195977e69a287ef8003f0.gif'
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
    gifUrl: 'https://i.pinimg.com/736x/c3/a2/ab/c3a2ab2eeb313fed71a4c30112dbd6c2.jpg'
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
    gifUrl: 'https://i.pinimg.com/originals/4b/bb/42/4bbb42ef233861f68ca244692493cb3d.gif'
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
    gifUrl: 'https://i.pinimg.com/originals/c0/d3/c9/c0d3c948ede881f235ee6e6ea97e57b4.gif'
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
    gifUrl: 'https://cdn.jefit.com/assets/img/exercises/gifs/677.gif'
  },
  {
    name: 'Russian Twist',
    description: 'A rotational core exercise that targets the obliques',
    category: 'Core',
    defaultSets: 3,
    defaultReps: 20,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Sit on the floor with knees bent',
      'Lean back slightly, keeping back straight',
      'Twist torso to the right, then to the left',
      'For added difficulty, hold a weight'
    ],
    gifUrl: 'https://www.spotebi.com/wp-content/uploads/2015/04/russian-twist-exercise-illustration.gif'
  },
  {
    name: 'Bicycle Crunches',
    description: 'A dynamic core exercise that targets abs and obliques',
    category: 'Core',
    defaultSets: 3,
    defaultReps: 20,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Lie on your back with hands behind head',
      'Lift shoulders and feet off the ground',
      'Bring right elbow to left knee while extending right leg',
      'Alternate sides in a pedaling motion'
    ],
    gifUrl: 'https://spotebi.com/wp-content/uploads/2014/10/bicycle-crunches-exercise-illustration.gif'
  },
  {
    name: 'Bird Dogs',
    description: 'A core stabilization exercise that improves balance',
    category: 'Core',
    defaultSets: 3,
    defaultReps: 10,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Start on hands and knees',
      'Extend right arm forward and left leg back',
      'Hold for 2 seconds',
      'Return to start and switch sides'
    ],
    gifUrl: 'https://spotebi.com/wp-content/uploads/2014/10/bird-dogs-exercise-illustration.gif'
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
    gifUrl: 'https://spotebi.com/wp-content/uploads/2014/10/arm-circles-exercise-illustration.gif'
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
    gifUrl: 'https://spotebi.com/wp-content/uploads/2015/03/forward-leg-swings-exercise-illustration.gif'
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
    gifUrl: 'https://spotebi.com/wp-content/uploads/2015/03/ankle-circles-exercise-illustration.gif'
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
    gifUrl: 'https://i.pinimg.com/originals/df/fe/69/dffe6942482eec2e35535efc602f589f.gif'
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
    gifUrl: 'https://www.shutterstock.com/image-vector/woman-doing-standing-hamstring-stretch-260nw-2391067277.jpg'
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
    gifUrl: 'https://www.spotebi.com/wp-content/uploads/2015/03/calf-stretch-exercise-illustration.gif'
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
    gifUrl: 'https://i.pinimg.com/736x/7b/5a/9d/7b5a9df8b0155d01455abe5afc58d9f4.jpg'
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
    gifUrl: 'https://spotebi.com/wp-content/uploads/2014/11/ab-stretch-exercise-illustration.gif'
  },
  {
    name: "Child's Pose",
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
    gifUrl: 'https://i0.wp.com/post.medicalnewstoday.com/wp-content/uploads/sites/3/2023/10/Childs-Pose.gif?w=315&h=840'
  },
  {
    name: 'Cat Cow Pose',
    description: 'A gentle flow to warm up the spine and relieve back tension',
    category: 'Stretching',
    defaultSets: 2,
    defaultReps: 8,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Start on hands and knees',
      'Inhale, arch back and look up (cow)',
      'Exhale, round back and tuck chin (cat)',
      'Flow between positions smoothly'
    ],
    gifUrl: 'https://i.pinimg.com/originals/ee/4f/c2/ee4fc2c391d7df81e2e55f7b2e419924.gif'
  },
  {
    name: 'Shoulder Rolls',
    description: 'A stretch for the shoulders',
    category: 'Stretching',
    defaultSets: 2,
    defaultReps: 10,
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Stand with arms at sides',
      'Roll shoulders forward',
      'Roll shoulders backward',
      'Keep neck relaxed'
    ],
    gifUrl: 'https://i.pinimg.com/originals/dd/94/6b/dd946b36434612cae6d4ce39d57b1882.gif'
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