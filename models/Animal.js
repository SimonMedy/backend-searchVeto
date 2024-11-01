const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Animal = sequelize.define('Animal', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  race: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
});


User.hasMany(Animal, { foreignKey: 'ownerId', as: 'animals' });
Animal.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

module.exports = Animal;
