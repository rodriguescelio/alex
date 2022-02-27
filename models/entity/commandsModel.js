const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  sequelize.define('command', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    command: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING,
    },
    text: {
      type: DataTypes.TEXT,
    },
    image: {
      type: DataTypes.STRING,
    },
    video: {
      type: DataTypes.STRING,
    },
    audio: {
      type: DataTypes.STRING,
    },
    playAudio: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdBy: {
      allowNull: false,
      type: DataTypes.STRING,
    }
  });
};
