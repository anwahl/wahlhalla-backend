/**
 * @swagger
 * components:
 *   schemas:
 *     TargetType:
 *       type: object
 *       description: Entity with a description.
 *       properties:
 *         id:
 *           type: integer
 *           description: ID of the target type.
 *           example: 10
 *         description:
 *           type: string
 *           description: The target type's description.
 *         createdAt:
 *           type: date
 *           description: The date the target type was created.
 *           example: 2023-01-01T01:13:51.000Z
 *         updatedAt:
 *           type: date
 *           description: The date the target type was updated.
 *           example: 2023-01-01T01:13:51.000Z 
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