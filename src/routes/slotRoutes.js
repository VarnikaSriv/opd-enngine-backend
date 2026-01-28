const express = require('express');
const Slot = require('../models/Slot');

const router = express.Router();

// POST /slot → create slot (validate capacity)
router.post('/slot', async (req, res) => {
  try {
    const { doctorId, startTime, endTime, capacity } = req.body;

    if (!doctorId || !startTime || !endTime || capacity == null) {
      return res.status(400).json({ error: 'doctorId, startTime, endTime and capacity are required' });
    }

    if (typeof capacity !== 'number' || capacity <= 0) {
      return res.status(400).json({ error: 'capacity must be a positive number' });
    }

    const slot = await Slot.create({
      doctorId,
      startTime,
      endTime,
      capacity,
      tokens: [],
    });

    res.status(201).json(slot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create slot' });
  }
});

// GET /slot/:id → get slot with tokens populated
router.get('/slot/:id', async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id).populate('tokens');
    if (!slot) {
      return res.status(404).json({ error: 'Slot not found' });
    }
    res.json(slot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch slot' });
  }
});

module.exports = router;

