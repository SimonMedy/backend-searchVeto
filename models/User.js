const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  roles: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "ROLE_USER",
    get() {
      const roles = this.getDataValue("roles");
      return roles ? roles.split(",") : [];
    },
    set(val) {
      this.setDataValue("roles", val.join(","));
    },
  },
});

module.exports = User;
