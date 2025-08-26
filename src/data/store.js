// Simple in-memory store (replace with DB later if needed)
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs';

const now = () => new Date().toISOString();

export const db = {
  users: [],
  posts: [],
  events: [],
  emergencies: [],
  achievements: [],
  chats: {
    rooms: [],
    messages: [],
  },
};

// Seed a demo user
const passwordHash = bcrypt.hashSync('password123', 10);
const demoUserId = uuid();
db.users.push({
  id: demoUserId,
  name: 'Demo User',
  email: 'demo@example.com',
  passwordHash,
  phone: '+1000000000',
  location: 'Demo City',
  createdAt: now(),
  updatedAt: now(),
});

// Helpers
export function createId() {
  return uuid();
}


