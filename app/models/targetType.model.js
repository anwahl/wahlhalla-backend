module.exports = (sequelize, Sequelize) => {
    const TargetType = sequelize.define("targetType", {
      description: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
    return TargetType;
  };