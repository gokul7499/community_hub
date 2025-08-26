import { Router } from 'express';
import { db } from '../data/store.js';

const router = Router();

router.get('/', (req, res) => {
  const users = db.users.map((u) => ({ id: u.id, name: u.name, email: u.email, phone: u.phone, location: u.location }));
  res.json({ items: users, total: users.length });
});

router.get('/:id', (req, res) => {
  const user = db.users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ id: user.id, name: user.name, email: user.email, phone: user.phone, location: user.location });
});

export default router;


