const express = require('express');
const Doctor = require('../models/Doctor');

const router = express.Router();

// POST /doctor → create doctor
router.post('/doctor', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const doctor = await Doctor.create({ name });
    res.status(201).json(doctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create doctor' });
  }
});

// GET /doctor → list doctors
router.get('/doctor', async (_req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

module.exports = router;

