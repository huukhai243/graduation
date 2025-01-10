module.exports = (sequelize, DataTypes) => {
    const Parking = sequelize.define("Parking", {
        ParkingType: {
            type: DataTypes.STRING,
            allowNull: false,
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
        paymentdate: {
            type: DataTypes.DATE,
        },
    });

    Parking.associate = (db) => {
        db["Parking"].belongsTo(db["User"], {
            foreignKey: "userId",
        });

        db["Parking"].belongsTo(db["Month"], {
            foreignKey: "monthId",
        });
    };

    return Parking;
};
