module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    UserID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Phone: {
      type: DataTypes.STRING,
      allowNull: true, // Có thể là null
    },
    RoomNumber: {
      type: DataTypes.STRING,
      allowNull: true, // Có thể là null
    },
    Building: {
      type: DataTypes.STRING,
      allowNull: true, // Có thể là null
    },
    UserType: {
      type: DataTypes.STRING,
      allowNull: true, // Có thể là null
    },
    Gender: {
      type: DataTypes.STRING,
      allowNull: true, // Có thể là null
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: true, // Có thể là null
      validate: {
        isEmail: true, // Kiểm tra định dạng email
      },
    },
  });

  return User;
};
