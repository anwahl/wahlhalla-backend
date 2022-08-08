module.exports = (sequelize, Sequelize) => {
    const Task = sequelize.define("task", {
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.INTEGER,
        references: {
            model: 'taskTypes',
            key: 'id',
         },
         allowNull: false
      },
      target: {
        type: Sequelize.INTEGER,
        references: {
            model: 'targets',
            key: 'id',
         },
         allowNull: false
      },
      value: {
        type: Sequelize.INTEGER
      }
    });
    return Task;
  };