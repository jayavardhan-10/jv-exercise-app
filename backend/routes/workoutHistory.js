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
  try {
    const { userId } = req.params;
    const workouts = await WorkoutHistory.find({ userId }).sort({ date: -1 });
    
    if (workouts.length === 0) {
      return res.json({ 
        streak: 0,
        lastWorkout: null,
        streakDates: [],
        totalWorkouts: 0,
        longestStreak: 0
      });
    }
    
    // Get unique workout dates (in case of multiple workouts per day)
    const workoutDates = [...new Set(
      workouts.map(workout => {
        const date = new Date(workout.date);
        return date.toISOString().split('T')[0]; // YYYY-MM-DD format
      })
    )];
    
    // Calculate current streak
    let streak = 0;
    let streakDates = [];
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];
    const hasWorkoutToday = workoutDates.includes(todayStr);
    let currentDate = new Date(today);
    if (!hasWorkoutToday) {
      currentDate.setDate(currentDate.getDate() - 1);
    }
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      if (!workoutDates.includes(dateStr)) {
        break;
      }
      streak++;
      streakDates.push(dateStr);
      currentDate.setDate(currentDate.getDate() - 1);
    }
    // Calculate longest streak ever
    let longestStreak = 0;
    let tempStreak = 1;
    for (let i = 1; i < workoutDates.length; i++) {
      const prev = new Date(workoutDates[i - 1]);
      const curr = new Date(workoutDates[i]);
      const diff = (prev - curr) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        tempStreak++;
      } else {
        if (tempStreak > longestStreak) longestStreak = tempStreak;
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) longestStreak = tempStreak;
    // Get last workout date
    const lastWorkout = workouts[0].date;
    res.json({ 
      streak,
      lastWorkout,
      streakDates,
      totalWorkouts: workouts.length,
      longestStreak
    });
  } catch (err) {
    console.error('Error calculating streak:', err);
    res.status(500).json({ error: 'Failed to calculate streak' });
  }
});

module.exports = router; 