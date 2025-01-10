// month.js
module.exports = (sequelize, DataTypes) => {
    const ConfigPayment = sequelize.define(
        "ConfigPayment",
        {
            key: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            value: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
        },
        {
            timestamps: false,
        }
    );

    return ConfigPayment;
};
