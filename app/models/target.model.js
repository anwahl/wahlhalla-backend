module.exports = (sequelize, Sequelize) => {
    const Target = sequelize.define("target", {
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.INTEGER,
        references: {
            model: 'targetTypes',
            key: 'id',
         },
         allowNull: false
      }
    });
    return Target;
  };