// room.js
module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define("Report", {
    title: {
      type: DataTypes.STRING,
    },
    content: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    video: {
      type: DataTypes.STRING,
    },
    parentId: {
      type: DataTypes.INTEGER,
    },
  });

  Report.associate = (db) => {
    db["Report"].belongsTo(db["User"]);
    db["Report"].hasMany(db["Report"], {
      foreignKey: "parentId",
      as: "Reports",
    });
  };

  return Report;
};
