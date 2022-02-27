const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  sequelize.define('bankReward', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userId: DataTypes.STRING,
  });
};
