const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  sequelize.define('wordDay', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    word: DataTypes.STRING,
    meaning: DataTypes.TEXT,
    answeredUserId: DataTypes.STRING,
  });
};
