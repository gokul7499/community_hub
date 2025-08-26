const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');

// Using in-memory store for events to match existing frontend expectations
const { db, createId } = require('../data/store');

const router = express.Router();

router.get('/', (req, res) => {
  const items = [...db.events].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  res.json({ items, total: items.length });
});

router.post(
  '/',
  protect,
  body('title').notEmpty(),
  body('description').notEmpty(),
  body('startTime').notEmpty(),
  body('endTime').notEmpty(),
  body('location').notEmpty(),
  body('type').notEmpty(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: 'Validation error', errors: errors.array() });
    const userId = req.user._id?.toString?.() || req.user.id;
    const { title, description, startTime, endTime, location, latitude = null, longitude = null, type, maxParticipants = 0, tags = [], isVirtual = false, virtualMeetingLink = null } = req.body;
    const event = {
      id: createId(),
      title,
      description,
      organizerId: userId,
      startTime,
      endTime,
      location,
      latitude,
      longitude,
      type,
      status: 'upcoming',
      maxParticipants,
      participantIds: [],
      tags,
      isVirtual,
      virtualMeetingLink,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.events.push(event);
    res.status(201).json(event);
  }
);

router.post('/:id/join', protect, (req, res) => {
  const event = db.events.find((e) => e.id === req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  if (event.maxParticipants > 0 && event.participantIds.length >= event.maxParticipants) {
    return res.status(400).json({ message: 'Event is full' });
  }
  const userId = req.user._id?.toString?.() || req.user.id;
  if (!event.participantIds.includes(userId)) event.participantIds.push(userId);
  event.updatedAt = new Date().toISOString();
  res.json(event);
});

module.exports = router;


