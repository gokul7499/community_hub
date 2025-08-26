import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { db, createId } from '../data/store.js';
import { authRequired } from '../utils/auth.js';

const router = Router();

router.get('/', (req, res) => {
  const items = [...db.emergencies].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ items, total: items.length });
});

router.post(
  '/',
  authRequired,
  body('type').notEmpty(),
  body('priority').notEmpty(),
  body('title').notEmpty(),
  body('description').notEmpty(),
  body('location').notEmpty(),
  body('latitude').isFloat(),
  body('longitude').isFloat(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: 'Validation error', errors: errors.array() });
    const {
      type,
      priority,
      title,
      description,
      location,
      latitude,
      longitude,
      requiresImmediateResponse = false,
      estimatedResponseTime = 15,
    } = req.body;

    const alert = {
      id: createId(),
      userId: req.user.id,
      type,
      priority,
      title,
      description,
      location,
      latitude,
      longitude,
      status: 'active',
      responderIds: [],
      responses: [],
      createdAt: new Date().toISOString(),
      resolvedAt: null,
      requiresImmediateResponse,
      estimatedResponseTime,
    };
    db.emergencies.push(alert);
    res.status(201).json(alert);
  }
);

router.post('/:id/respond', authRequired, (req, res) => {
  const alert = db.emergencies.find((e) => e.id === req.params.id);
  if (!alert) return res.status(404).json({ message: 'Alert not found' });
  if (!alert.responderIds.includes(req.user.id)) alert.responderIds.push(req.user.id);
  alert.responses.push({
    id: createId(),
    responderId: req.user.id,
    message: 'Responding',
    status: 'accepted',
    timestamp: new Date().toISOString(),
    estimatedArrivalTime: 0,
  });
  alert.updatedAt = new Date().toISOString();
  res.json(alert);
});

export default router;


