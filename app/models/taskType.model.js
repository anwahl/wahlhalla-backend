/**
 * A Task Type
 * @typedef {object} TaskType
 * @property {string} description.required - Description of the Task Type
 * @property {string} category.required - Category of the Task Type (CHORE, BILL, APPOINTMENT, LIST, OTHER)
 */

module.exports = (sequelize, Sequelize) => {
    const TaskType = sequelize.define("taskType", {
      description: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
          name: 'uniqueTaskType',
          msg: 'Task Type Already Exists.'
        }
      },
      category: {
        type: Sequelize.ENUM('CHORE','BILL','APPOINTMENT','LIST','OTHER'),
        allowNull: false,
        unique: {
          name: 'uniqueTaskType',
          msg: 'Task Type Already Exists.'
        }
      }
    });
    return TaskType;
  };