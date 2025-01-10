// building.js
module.exports = (sequelize, DataTypes) => {
  const Building = sequelize.define("Building", {
    buildingid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    numberoffloor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    numberofroom: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    roomtype: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Building.associate = (db) => {
    db["Building"].hasMany(db["Room"], {
      foreignKey: "buildingid",
    });
  };

  return Building;
};
