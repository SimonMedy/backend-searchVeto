const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const { Op } = require('sequelize');
const { authenticateToken, checkAdmin } = require('../middleware/auth');
require('dotenv').config();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ where: { [Op.or]: [{ email }, { name }] } });
    if (userExists) {
      return res.status(400).json({ message: "Un utilisateur avec le même nom ou email existe déjà." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser, token });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

router.get('/me', authenticateToken, (req, res) => {
  res.status(200).json(req.user);
});

router.get('/admin', authenticateToken, checkAdmin, (req, res) => {
  res.status(200).json({ message: 'Accès accordé' });
});

module.exports = router;
