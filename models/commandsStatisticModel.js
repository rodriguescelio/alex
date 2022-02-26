const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  sequelize.define('commandsStatistic', {
    id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
    },
    user: DataTypes.STRING,
    command: DataTypes.STRING,
  });
};