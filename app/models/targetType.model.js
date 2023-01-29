/**
 * @swagger
 * components:
 *   schemas:
 *     TargetType:
 *       type: object
 *       description: Entity with a description.
 *       properties:
 *         description:
 *           type: string
 *           description: The target type's description.
 *       required:
 *         - description
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