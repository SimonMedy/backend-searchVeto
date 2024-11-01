const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Animal = require('./Animal');
const Clinic = require('./Clinic');
const TimeSlot = require('./Timeslot');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  timeSlotId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TimeSlot,
      key: 'id',
    },
  },
  animalId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Animal,
      key: 'id',
    },
  },
  clinicId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Clinic,
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
});

User.hasMany(Appointment, { foreignKey: 'userId', as: 'userAppointments' });
Animal.hasMany(Appointment, { foreignKey: 'animalId', as: 'animalAppointments' });
Clinic.hasMany(Appointment, { foreignKey: 'clinicId', as: 'clinicAppointments' });
TimeSlot.hasMany(Appointment, { foreignKey: 'timeSlotId', as: 'appointments' });

Appointment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Appointment.belongsTo(Animal, { foreignKey: 'animalId', as: 'animal' });
Appointment.belongsTo(Clinic, { foreignKey: 'clinicId', as: 'clinic' });
Appointment.belongsTo(TimeSlot, { foreignKey: 'timeSlotId', as: 'timeSlot' });

module.exports = Appointment;