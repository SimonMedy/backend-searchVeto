const express = require('express');
const sequelize = require('./config/database');
const cors = require('cors');
const User = require('./models/User');
const Clinic = require('./models/Clinic');
const Animal = require('./models/Animal');
const Appointment = require('./models/Appointment');
const authRoutes = require('./routes/auth');
const clinicRoutes = require('./routes/ClinicCrud');
const animalRoutes = require('./routes/animalRoutes');
const timeSlotRoutes = require('./routes/timeSlotRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

require('dotenv').config();
const app = express();
app.use(express.json());

// Configurer CORS pour n'autoriser que les domaines de Vercel
const allowedOrigins = [/\.vercel\.app$/]; // Utilisation d'une regex pour accepter tous les sous-domaines de Vercel
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some((pattern) => pattern.test(origin))) {
      callback(null, true);
    } else {
      callback(new Error('Non autorisé par CORS'));
    }
  }
}));

// Route de test pour vérifier si l'API est en ligne
app.get('/', (req, res) => {
  res.json({ message: 'L\'API est en ligne' });
});

// Routes existantes
app.use('/auth', authRoutes);
app.use('/clinics', clinicRoutes);
app.use('/animals', animalRoutes);
app.use('/timeSlots', timeSlotRoutes);
app.use('/appointments', appointmentRoutes);

async function startServer() {
  try {

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Le serveur fonctionne sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('Impossible de synchroniser la base de données:', error);
  }
}

startServer();
