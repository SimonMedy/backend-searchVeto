const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.POSTGRES_DATABASE,          // Nom de la base de données
  process.env.POSTGRES_USER,              // Utilisateur de la base de données
  process.env.POSTGRES_PASSWORD,          // Mot de passe de la base de données
  {
    host: process.env.POSTGRES_HOST,      // Hôte de la base de données
    dialect: 'postgres',                  // Dialecte de Sequelize
    port: process.env.POSTGRES_PORT || 6543, // Port de la base de données (défaut 6543 si non défini)
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,       // Désactiver la vérification SSL pour éviter les erreurs
      },
    },
  }
);

module.exports = sequelize;
