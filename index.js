const express = require('express');

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
app.use(cors());

// Route de test pour vérifier si l'API est en ligne
app.get('/', (req, res) => {
  res.json({ message: 'L\'API est en ligne' });
});

// Routes existantes


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
