const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');

const router = express.Router();

const signToken = (admin) =>
  jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    let admin = await Admin.findOne({ email: normalizedEmail });

    // First-run bootstrap: if no admin exists yet but env credentials match, create one.
    if (!admin) {
      const envEmail = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
      const envPassword = process.env.ADMIN_PASSWORD || '';
      const adminCount = await Admin.countDocuments();

      if (
        adminCount === 0 &&
        envEmail &&
        envPassword &&
        normalizedEmail === envEmail &&
        password === envPassword
      ) {
        const passwordHash = await bcrypt.hash(envPassword, 10);
        admin = await Admin.create({ email: envEmail, passwordHash });
      } else {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      const ok = await bcrypt.compare(password, admin.passwordHash);
      if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(admin);
    res.json({ token, admin: { id: admin._id, email: admin.email } });
  } catch (err) {
    next(err);
  }
});

router.get('/me', auth, async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('email createdAt');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
