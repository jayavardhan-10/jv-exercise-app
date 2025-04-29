const express = require('express');
const router = express.Router();
const Workout = require('../models/workout');

// Get all workouts
router.get('/', async (req, res) => {
    try {
        const workouts = await Workout.find();
        res.json(workouts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new workout
router.post('/', async (req, res) => {
    try {
        const workout = new Workout(req.body);
        const savedWorkout = await workout.save();
        res.status(201).json(savedWorkout);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update workout
router.put('/:id', async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);
        if (!workout) {
            return res.status(404).json({ message: 'Workout not found' });
        }
        
        Object.assign(workout, req.body);
        const updatedWorkout = await workout.save();
        res.json(updatedWorkout);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete workout
router.delete('/:id', async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);
        if (!workout) {
            return res.status(404).json({ message: 'Workout not found' });
        }
        
        await workout.deleteOne();
        res.json({ message: 'Workout deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 