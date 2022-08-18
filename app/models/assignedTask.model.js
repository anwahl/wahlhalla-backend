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
        type: Sequelize.ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'STANDALONE'),
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
              fields: ['personId', 'taskId','type','timeOfDay','endTimeOfDay','dueDate']
          }
      ]
   });
    return AssignedTask;
  };