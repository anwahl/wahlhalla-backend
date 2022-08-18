module.exports = (sequelize, Sequelize) => {
    const Target = sequelize.define("target", {
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      typeId: {
        type: Sequelize.INTEGER,
         allowNull: false
      }
    },
    {
      indexes: [
          {
              unique: true,
              fields: ['typeId', 'description']
          }
      ]
   });
    return Target;
  };