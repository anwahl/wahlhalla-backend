/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       description: Entity with a description, task type, target, and value. Uniqueness is defined by the description, task type, and target.
 *       properties:
 *         id:
 *           type: integer
 *           description: ID of the task.
 *           example: 10
 *         description:
 *           type: string
 *           description: The task's description.
 *           example: task description
 *         typeId:
 *           type: integer
 *           description: The ID of the task type for the task.
 *           example: 9
 *         targetId:
 *           type: integer
 *           description: The ID of the target for the task.
 *           example: 3
 *         value:
 *           type: integer
 *           description: The value of the task.
 *           example: 150
 *         createdAt:
 *           type: date
 *           description: The date the task was created.
 *           example: 2023-01-01T01:13:51.000Z
 *         updatedAt:
 *           type: date
 *           description: The date the task was updated.
 *           example: 2023-01-01T01:13:51.000Z 
 *       required:
 *         - description
 *         - typeId
 *         - targetId
 */

module.exports = (sequelize, Sequelize) => {
    const Task = sequelize.define("task", {
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      typeId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'taskTypes',
            key: 'id',
         },
         allowNull: false
      },
      targetId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'targets',
            key: 'id',
         },
         allowNull: false
      },
      value: {
        type: Sequelize.INTEGER
      }
    },
    {
      indexes: [
          {
              unique: true,
              fields: ['description', 'typeId', 'targetId'],
              msg: "Task already exists."
          }
      ]
   });
    return Task;
  };