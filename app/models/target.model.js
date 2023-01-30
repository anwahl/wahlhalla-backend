/**
 * @swagger
 * components:
 *   schemas:
 *     Target:
 *       type: object
 *       description: Entity with a description and target type.
 *       properties:
 *         id:
 *           type: integer
 *           description: ID of the target.
 *           example: 10
 *         description:
 *           type: string
 *           description: The target's description.
 *           example: target description
 *         typeId:
 *           type: integer
 *           description: The ID of the target type for the target.
 *           example: 2
 *         createdAt:
 *           type: date
 *           description: The date the target was created.
 *           example: 2023-01-01T01:13:51.000Z
 *         updatedAt:
 *           type: date
 *           description: The date the target was updated.
 *           example: 2023-01-01T01:13:51.000Z    
 *       required:
 *         - description
 *         - typeId
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