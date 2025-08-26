import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { db, createId } from '../data/store.js';
import { authRequired } from '../utils/auth.js';

const router = Router();

// GET /api/posts?category=&status=&page=&limit=
router.get('/', (req, res) => {
  const { category, status, page = 1, limit = 10 } = req.query;
  let list = [...db.posts];
  if (category) list = list.filter((p) => p.category === category);
  if (status) list = list.filter((p) => p.status === status);
  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const p = Number(page);
  const l = Number(limit);
  const start = (p - 1) * l;
  const end = start + l;
  const items = list.slice(start, end);
  return res.json({ items, total: list.length, page: p, hasMore: end < list.length });
});

// POST /api/posts
router.post(
  '/',
  authRequired,
  body('title').notEmpty(),
  body('description').notEmpty(),
  body('category').notEmpty(),
  body('location').notEmpty(),
  body('urgency').notEmpty(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation error', errors: errors.array() });
    }
    const { title, description, category, location, urgency, images = [], tags = [] } = req.body;
    const user = db.users.find((u) => u.id === req.user.id);
    const post = {
      id: createId(),
      userId: user?.id,
      user: user ? { id: user.id, name: user.name, email: user.email } : null,
      title,
      description,
      category,
      location,
      urgency,
      status: 'open',
      images,
      tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.posts.push(post);
    return res.status(201).json(post);
  }
);

export default router;


