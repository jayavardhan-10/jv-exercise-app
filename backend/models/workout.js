const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  exerciseName: {
    type: String,
    required: true
  },
  sets: [{
    type: Number,
    required: true
  }],
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
workoutSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout; 