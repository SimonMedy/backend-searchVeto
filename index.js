const express = require('express');
const sequelize = require('./config/database');
const cors = require('cors');
const User = require('./models/User');
const Clinic = require('./models/Clinic');
const Animal = require('./models/Animal');
const Appointment = require('./models/Appointment');
const authRoutes = require('./routes/auth');
const clinicRoutes = require('./routes/ClinicCrud');
const animalRoutes = require('./routes/animalRoutes')
const timeSlotRoutes = require('./routes/timeSlotRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors());

app.use('/', authRoutes);
app.use('/clinics', clinicRoutes);
app.use('/animals', animalRoutes);
app.use('/timeSlots', timeSlotRoutes);
app.use('/appointments', appointmentRoutes);

async function startServer() {
  try {
    await sequelize.sync();
    console.log('Base de données synchronisée avec succès.');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Le serveur fonctionne sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('Impossible de synchroniser la base de données:', error);
  }
}

startServer();
