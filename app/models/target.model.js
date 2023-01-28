/**
 * A Target
 * @typedef {object} Target
 * @property {string} description.required - Description of the Target
 * @property {integer} typeId.required - ID of the Target Type
 */

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
              fields: ['typeId', 'description'],
              msg: "Target already exists."
          }
      ]
   });
    return Target;
  };