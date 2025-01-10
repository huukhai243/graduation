// changeroom.js
module.exports = (sequelize, DataTypes) => {
  const ChangeRoom = sequelize.define("ChangeRoom", {
    oldRoomId: {
      type: DataTypes.INTEGER,
    },
    newRoomId: {
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.STRING,
    },
    registrationstatus: {
      type: DataTypes.STRING,
    },
  });

  ChangeRoom.associate = (db) => {
    db["ChangeRoom"].belongsTo(db["User"]);
    db["ChangeRoom"].belongsTo(db["Room"], {
      foreignKey: "oldRoomId",
      as: "oldRoom",
    });
    db["ChangeRoom"].belongsTo(db["Room"], {
      foreignKey: "newRoomId",
      as: "newRoom",
    });
  };

  return ChangeRoom;
};
