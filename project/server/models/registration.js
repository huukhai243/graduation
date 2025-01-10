// registration.js
module.exports = (sequelize, DataTypes) => {
  const Registration = sequelize.define("Registration", {
    RoomNumber1: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    RoomNumber2: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    RoomNumber3: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    registrationstatus: {
      type: DataTypes.STRING,
    },
    RoomActive: {
      type: DataTypes.INTEGER,
    },
  });

  Registration.associate = (db) => {
    db["Registration"].belongsTo(db["User"]);
    db["Registration"].belongsTo(db["Room"], {
      foreignKey: "RoomNumber1",
      as: "Room1",
    });
    db["Registration"].belongsTo(db["Room"], {
      foreignKey: "RoomNumber2",
      as: "Room2",
    });
    db["Registration"].belongsTo(db["Room"], {
      foreignKey: "RoomNumber3",
      as: "Room3",
    });
  };

  return Registration;
};
