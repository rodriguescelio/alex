const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  sequelize.define('wordDayAnswer', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    wordId: DataTypes.INTEGER,
    userId: DataTypes.STRING,
    status: DataTypes.STRING,
  });
};
