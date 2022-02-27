const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  sequelize.define('bank', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userId: DataTypes.STRING,
    operation: DataTypes.STRING,
    value: DataTypes.NUMBER,
    description: DataTypes.TEXT,
  });
};
