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