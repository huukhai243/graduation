// month.js
module.exports = (sequelize, DataTypes) => {
    const Month = sequelize.define(
        "Month",
        {
            time: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            timestamps: false,
        }
    );

    return Month;
};
