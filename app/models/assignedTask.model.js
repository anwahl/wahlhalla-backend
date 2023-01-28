/**
 * An Assigned Task
 * @typedef {object} AssignedTask
 * @property {integer} personId - ID of the Person assigned to the Assigned Task.
 * @property {integer} taskId.required - ID of the Task of the Assigned Task.
 * @property {string} type.required - Type of schedule for the Assigned Task (DAILY, WEEKLY, BIWEEKLY, MONTHLY, YEARLY, STANDALONE).
 * @property {string} timeOfDay - Start time for the Assigned Task.
 * @property {string} endTimeOfDay - End time for the Assigned Task.
 * @property {string} dueDate.required - Due date of the Assigned Task.
 * @property {integer} occurrences - Number of Occurrences of the Assigned Task.
 * @property {boolean} complete.required - If the Assigned Task is complete.
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