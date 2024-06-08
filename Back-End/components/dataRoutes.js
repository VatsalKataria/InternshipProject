const express = require('express');
const router = express.Router();
const MachineModel = require('../models/Machines');

// Fetch all machines
router.get('/machines', async (req, res) => {
    try {
        const machines = await MachineModel.find();
        res.json(machines);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update existing data
router.put('/machines/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const machine = await MachineModel.findByIdAndUpdate(id, updatedData, { new: true });
        res.json(machine);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete existing data
router.delete('/machines/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await MachineModel.findByIdAndDelete(id);
        res.json({ message: 'Data deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
