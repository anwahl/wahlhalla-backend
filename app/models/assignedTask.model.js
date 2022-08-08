module.exports = (sequelize, Sequelize) => {
    const AssignedTask = sequelize.define("assignedTask", {
      person: {
        type: Sequelize.INTEGER,
        references: {
            model: 'people',
            key: 'id',
         }
      },
      task: {
        type: Sequelize.INTEGER,
        references: {
            model: 'tasks',
            key: 'id',
         },
         allowNull: false
      },
      type: {
        type: Sequelize.ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'STANDALONE'),
        allowNull: false
      },
      timeOfDay: {
        type: Sequelize.TIME
      },
      dueDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      complete: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      }
    });
    return AssignedTask;
  };