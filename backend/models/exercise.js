const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Strength', 'Cardio', 'Core', 'Warmup', 'Stretching'],
    trim: true
  },
  defaultSets: {
    type: Number,
    default: 3
  },
  defaultReps: {
    type: Number,
    default: 10
  },
  equipment: {
    type: String,
    default: 'Bodyweight',
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  instructions: [{
    type: String,
    required: true
  }],
  gifUrl: {
    type: String,
    required: true
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
exerciseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise; 