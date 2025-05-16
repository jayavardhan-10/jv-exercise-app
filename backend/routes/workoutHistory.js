const express = require('express');
const router = express.Router();
const WorkoutHistory = require('../models/workoutHistory');

// Save a completed workout
router.post('/', async (req, res) => {
  try {
    const workout = new WorkoutHistory(req.body);
    await workout.save();
    res.status(201).json(workout);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all workouts for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const workouts = await WorkoutHistory.find({ userId }).sort({ date: -1 });
  res.json(workouts);
});

// Get current streak for a user
router.get('/:userId/streak', async (req, res) => {
  const { userId } = req.params;
  const workouts = await WorkoutHistory.find({ userId }).sort({ date: -1 });
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  for (const workout of workouts) {
    const workoutDate = new Date(workout.date);
    workoutDate.setHours(0, 0, 0, 0);
    if (workoutDate.getTime() === currentDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (workoutDate < currentDate) {
      break;
    }
  }
  res.json({ streak });
});

module.exports = router; 