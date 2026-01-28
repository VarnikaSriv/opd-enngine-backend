const express = require('express');
const {
  bookToken,
  cancelToken,
  markNoShow,
  addEmergencyToken,
} = require('../services/allocator');

const router = express.Router();

// POST /token/book
router.post('/token/book', async (req, res) => {
  try {
    const { slotId, patientName, source } = req.body;
    if (!slotId || !patientName || !source) {
      return res.status(400).json({ error: 'slotId, patientName and source are required' });
    }

    const token = await bookToken(slotId, { patientName, source });
    res.status(201).json(token);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || 'Failed to book token' });
  }
});

// POST /token/cancel/:id
router.post('/token/cancel/:id', async (req, res) => {
  try {
    const token = await cancelToken(req.params.id);
    res.json(token);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || 'Failed to cancel token' });
  }
});

// POST /token/noshow/:id
router.post('/token/noshow/:id', async (req, res) => {
  try {
    const token = await markNoShow(req.params.id);
    res.json(token);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || 'Failed to mark no-show' });
  }
});

// POST /token/emergency
router.post('/token/emergency', async (req, res) => {
  try {
    const { slotId, patientName } = req.body;
    if (!slotId || !patientName) {
      return res.status(400).json({ error: 'slotId and patientName are required' });
    }

    const { emergencyToken, evictedToken } = await addEmergencyToken(slotId, {
      patientName,
    });
    res.status(201).json({ emergencyToken, evictedToken });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || 'Failed to add emergency token' });
  }
});

module.exports = router;

