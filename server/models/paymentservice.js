// payment.js
module.exports = (sequelize, DataTypes) => {
  const Paymentservice = sequelize.define("Paymentservice", {
    BuildingID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    electric: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    water: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    electricPrice: {
      type: DataTypes.FLOAT,
    },
    waterPrice: {
      type: DataTypes.FLOAT,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    PaymentType: {
      type: DataTypes.STRING,
    },
    paymentstatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Paymentdate: {
      type: DataTypes.DATE,
    },
  });

  Paymentservice.associate = (db) => {
    db["Paymentservice"].belongsTo(db["Room"], {
      foreignKey: "Roomnumber",
    });

    db["Paymentservice"].belongsTo(db["Month"], {
      foreignKey: "monthId",
    });
  };
  return Paymentservice;
};
