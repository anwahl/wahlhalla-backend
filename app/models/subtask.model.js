/**
 * @swagger
 * components:
 *   schemas:
 *     Subtask:
 *       type: object
 *       description: Entity with a description and an assigned task.
 *       properties:
 *         description:
 *           type: string
 *           description: The subtask's description.
 *           example: subtask description
 *         assignedTaskId:
 *           type: integer
 *           description: The ID of the assigned task for the subtask.
 *           example: 21
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