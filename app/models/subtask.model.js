module.exports = (sequelize, Sequelize) => {
    const SubTask = sequelize.define("subtask", {
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      assignedTaskId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'assignedTasks',
            key: 'id',
         },
         allowNull: false
      }
    },
    {
      indexes: [
          {
              unique: true,
              fields: ['description', 'assignedTaskId']
          }
      ]
   });
    return SubTask;
  };