import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { db, createId } from '../data/store.js';
import { generateToken, authRequired } from '../utils/auth.js';

const router = Router();

router.post(
  '/register',
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('phone').notEmpty(),
  body('location').notEmpty(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation error', errors: errors.array() });
    }
    const { name, email, password, phone, location } = req.body;
    const exists = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const id = createId();
    const passwordHash = bcrypt.hashSync(password, 10);
    const user = { id, name, email, passwordHash, phone, location, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    db.users.push(user);
    const token = generateToken({ id: user.id, email: user.email, name: user.name });
    return res.json({ token, user: { id: user.id, name, email, phone, location } });
  }
);

router.post(
  '/login',
  body('email').isEmail(),
  body('password').notEmpty(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation error', errors: errors.array() });
    }
    const { email, password } = req.body;
    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = bcrypt.compareSync(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = generateToken({ id: user.id, email: user.email, name: user.name });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, location: user.location } });
  }
);

router.get('/profile', authRequired, (req, res) => {
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json({ id: user.id, name: user.name, email: user.email, phone: user.phone, location: user.location });
});

export default router;


