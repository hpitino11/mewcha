const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Minimal but real email format check — not a security boundary, just sanity
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: 'All fields required' });

  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100)
    return res.status(400).json({ error: 'Name must be 2–100 characters' });

  if (typeof email !== 'string' || !EMAIL_RE.test(email) || email.length > 254)
    return res.status(400).json({ error: 'Invalid email address' });

  if (typeof password !== 'string' || password.length < 8 || password.length > 128)
    return res.status(400).json({ error: 'Password must be 8–128 characters' });

  try {
    const existing = await db('users').where({ email: email.toLowerCase() }).first();
    if (existing) return res.status(409).json({ error: 'Email already in use' });

    const password_hash = await bcrypt.hash(password, 10);
    const [user] = await db('users')
      .insert({ name: name.trim(), email: email.toLowerCase(), password_hash })
      .returning(['id', 'name', 'email', 'role']);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required' });

  if (typeof email !== 'string' || typeof password !== 'string')
    return res.status(400).json({ error: 'Invalid request' });

  try {
    const user = await db('users').where({ email: email.toLowerCase() }).first();
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
