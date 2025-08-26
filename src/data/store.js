// Simple in-memory store (replace with DB later if needed)
const { v4: uuid } = require('uuid');
const bcrypt = require('bcryptjs');

const now = () => new Date().toISOString();

const db = {
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
function createId() {
  return uuid();
}

module.exports = { db, createId };


