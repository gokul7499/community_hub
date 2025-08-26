import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { db, createId } from '../data/store.js';
import { authRequired } from '../utils/auth.js';

const router = Router();

router.get('/rooms', authRequired, (req, res) => {
  const rooms = db.chats.rooms.filter((r) => r.participantIds.includes(req.user.id));
  res.json({ items: rooms, total: rooms.length });
});

router.post('/rooms', authRequired, body('participantIds').isArray({ min: 1 }), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: 'Validation error', errors: errors.array() });
  const { participantIds } = req.body;
  const room = { id: createId(), participantIds: Array.from(new Set([req.user.id, ...participantIds])), lastMessage: null, lastMessageTime: null, unreadCount: 0, createdAt: new Date().toISOString() };
  db.chats.rooms.push(room);
  res.status(201).json(room);
});

router.get('/rooms/:id/messages', authRequired, (req, res) => {
  const messages = db.chats.messages.filter((m) => m.roomId === req.params.id);
  res.json({ items: messages, total: messages.length });
});

router.post(
  '/rooms/:id/messages',
  authRequired,
  body('content').notEmpty(),
  body('type').optional().isString(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: 'Validation error', errors: errors.array() });
    const room = db.chats.rooms.find((r) => r.id === req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    const { content, type = 'text', metadata = null } = req.body;
    const message = { id: createId(), roomId: room.id, senderId: req.user.id, content, type, timestamp: new Date().toISOString(), isRead: false, metadata };
    db.chats.messages.push(message);
    room.lastMessage = content;
    room.lastMessageTime = message.timestamp;
    res.status(201).json(message);
  }
);

export default router;


