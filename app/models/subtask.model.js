/**
 * @swagger
 * components:
 *   schemas:
 *     Subtask:
 *       type: object
 *       description: Entity with a description and an assigned task.
 *       properties:
 *         id:
 *           type: integer
 *           description: ID of the subtask.
 *           example: 10
 *         description:
 *           type: string
 *           description: The subtask's description.
 *           example: subtask description
 *         assignedTaskId:
 *           type: integer
 *           description: The ID of the assigned task for the subtask.
 *           example: 21
 *         createdAt:
 *           type: date
 *           description: The date the subtask was created.
 *           example: 2023-01-01T01:13:51.000Z
 *         updatedAt:
 *           type: date
 *           description: The date the subtask was updated.
 *           example: 2023-01-01T01:13:51.000Z    
 *       required:
 *         - description
 *         - assignedTaskId
 */
module.exports = (sequelize, Sequelize) => {
    const SubTask = sequelize.define("subtask", {
      description: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
          name: 'uniqueSubtask',
          msg: 'Subtask Already Exists.'
        }
      },
      assignedTaskId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'assignedTasks',
            key: 'id',
         },
         allowNull: false,
         unique: {
           name: 'uniqueSubtask',
           msg: 'Subtask Already Exists.'
         }
      }
    });
    return SubTask;
  };