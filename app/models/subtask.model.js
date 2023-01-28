/**
 * A Subtask
 * @typedef {object} Subtask
 * @property {string} description.required - Description of the subtask
 * @property {integer} assignedTaskId.required - Id of the Assigned Task
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