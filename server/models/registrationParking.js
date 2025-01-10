// registration.js
module.exports = (sequelize, DataTypes) => {
  const RegistrationParking = sequelize.define("RegistrationParking", {
    registrationstatus: {
      type: DataTypes.STRING,
    },
    info: {
      type: DataTypes.STRING,
    },
    parkingType: {
      type: DataTypes.STRING,
    },
  });

  RegistrationParking.associate = (db) => {
    db["RegistrationParking"].belongsTo(db["User"]);
  };

  return RegistrationParking;
};
