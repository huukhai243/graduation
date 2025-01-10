// payment.js
module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define("Payment", {
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
        paymentdate: {
            type: DataTypes.DATE,
        },
    });

    Payment.associate = (db) => {
        db["Payment"].belongsTo(db["User"], {
            foreignKey: "userId",
        });

        db["Payment"].belongsTo(db["Month"], {
            foreignKey: "monthId",
        });
    };
    return Payment;
};
