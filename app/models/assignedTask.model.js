
/**
 * @swagger
 * components:
 *   schemas:
 *     AssignedTask:
 *       type: object
 *       description: Entity with a person, task, schedule type, time of day, end time, due date, number of occurrences, and completion. Uniqueness is defined by the person, task, start/end times, due date,
 *       properties:
 *         personId:
 *           type: integer
 *           description: The ID of the person assigned to the assigned task.
 *           example: 5
 *         taskId:
 *           type: integer
 *           description: The ID of the task for the assigned task.
 *           example: 56
 *         type:
 *           type: enum
 *           description: The schedule type of the assigned task. In ['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'YEARLY', 'STANDALONE'].
 *           example: WEEKLY
 *         timeOfDay:
 *           type: time
 *           description: The start time of the assigned task.
 *           example: 10:00
 *         endTimeOfDay:
 *           type: time
 *           description: The end time of the assigned task.
 *           example: 12:00
 *         dueDate:
 *           type: date
 *           description: The due date of the assigned task.
 *           example: 2022-11-15
 *         occurrences:
 *           type: integer
 *           description: The number of occurrences of the assigned task.
 *           example: 12
 *         complete:
 *           type: boolean
 *           description: Whether the assigned task is complete.
 *           example: true
 *       required:
 *         - taskId
 *         - type
 *         - dueDate
 *         - complete
 */

module.exports = (sequelize, Sequelize) => {
    const AssignedTask = sequelize.define("assignedTask", {
      personId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'people',
            key: 'id',
         }
      },
      taskId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'tasks',
            key: 'id',
         },
         allowNull: false
      },
      type: {
        type: Sequelize.ENUM('DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'YEARLY', 'STANDALONE'),
        allowNull: false
      },
      timeOfDay: {
        type: Sequelize.TIME
      },
      endTimeOfDay: {
        type: Sequelize.TIME
      },
      dueDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      occurrences: {
        type: Sequelize.INTEGER
      },
      complete: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      }
    },
    {
      indexes: [
          {
              name: 'assignedTaskUK',
              unique: true,
              fields: ['personId', 'taskId','type','timeOfDay','endTimeOfDay','dueDate'],
              msg: 'Assigned Task already exists.'
          }
      ]
   });
    return AssignedTask;
  };