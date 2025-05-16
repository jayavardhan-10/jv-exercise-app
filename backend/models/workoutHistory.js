const mongoose = require('mongoose');

const workoutHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  workoutId: {
    type: String,
    required: true
  },
  workoutName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  duration: {
    type: Number,
    required: true
  },
  exercises: [{
    name: String,
    duration: Number,
    reps: Number,
    sets: Number
  }],
  totalExercises: {
    type: Number,
    required: true
  },
  intensity: {
    type: Number,
    required: true,
    default: 1
  }
}, {
  timestamps: true
});

// Index for faster queries
workoutHistorySchema.index({ userId: 1, date: -1 });

const WorkoutHistory = mongoose.model('WorkoutHistory', workoutHistorySchema);

module.exports = WorkoutHistory; 