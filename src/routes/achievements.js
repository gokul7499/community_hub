import { Router } from 'express';
import { db, createId } from '../data/store.js';
import { authRequired } from '../utils/auth.js';

const router = Router();

// Seed some default achievements if empty
if (db.achievements.length === 0) {
  db.achievements.push(
    { id: createId(), title: 'First Help', description: 'Complete your first help', iconPath: 'first_help.png', type: 'helping', points: 50, requiredCount: 1, category: 'helping' },
    { id: createId(), title: 'Helper Novice', description: 'Complete 5 helps', iconPath: 'helper_novice.png', type: 'helping', points: 100, requiredCount: 5, category: 'helping' },
  );
}

router.get('/', (req, res) => {
  res.json({ items: db.achievements, total: db.achievements.length });
});

router.get('/stats', authRequired, (req, res) => {
  // Simple mock stats
  const stats = {
    userId: req.user.id,
    totalPoints: 320,
    totalHelps: 7,
    totalVolunteerHours: 12,
    totalEvents: 3,
    totalAchievements: 2,
    currentStreak: 4,
    longestStreak: 9,
    lastActivity: new Date().toISOString(),
    categoryStats: {
      helping: 2,
      volunteering: 1,
      community: 0,
      emergency: 1,
      social: 0,
      skill: 0,
      milestone: 0,
      general: 0,
    },
    unlockedAchievements: db.achievements.slice(0, 2).map((a) => a.id),
  };
  res.json(stats);
});

export default router;


