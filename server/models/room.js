// room.js
module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define("Room", {
    Roomnumber: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    Roomslot: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    Roomgender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Room.associate = (db) => {
    db["Room"].belongsTo(db["Building"], {
      foreignKey: "buildingid",
    });
    db["Room"].hasMany(db["RoomUser"], {
      foreignKey: "RoomNumber",
    });
  };

  return Room;
};
