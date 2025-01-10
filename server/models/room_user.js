// registration.js
module.exports = (sequelize, DataTypes) => {
    const RoomUser = sequelize.define("RoomUser", {
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dateIn: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        dateOut: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    });

    return RoomUser;
};
