/**
 * A Target Type
 * @typedef {object} Target Type
 * @property {string} description.required - Description of the Target Type
 */

module.exports = (sequelize, Sequelize) => {
    const TargetType = sequelize.define("targetType", {
      description: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
            name: 'uniqueTargetType',
            msg: "Target Type already exists."
        }
      }
    });
    return TargetType;
  };