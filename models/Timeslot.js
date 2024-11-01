const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Clinic = require('./Clinic');

const TimeSlot = sequelize.define('TimeSlot', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  clinicId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Clinic,
      key: 'id',
    },
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  timeRange: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  available: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

Clinic.hasMany(TimeSlot, { foreignKey: 'clinicId', as: 'timeSlots' });
TimeSlot.belongsTo(Clinic, { foreignKey: 'clinicId', as: 'clinic' });

module.exports = TimeSlot;
