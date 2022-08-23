const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  sequelize.define('favorite', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userId: DataTypes.INTEGER,
    commandId: DataTypes.INTEGER,
  });
};
