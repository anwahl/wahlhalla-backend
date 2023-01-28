/**
 * A Task
 * @typedef {object} Task
 * @property {string} description.required - Description of the Task
 * @property {integer} typeId.required - ID of the Task Type
 * @property {integer} targetId.required - ID of the Target
 * @property {integer} value - Value of the task
 */

module.exports = (sequelize, Sequelize) => {
    const Task = sequelize.define("task", {
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      typeId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'taskTypes',
            key: 'id',
         },
         allowNull: false
      },
      targetId: {
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
    },
    {
      indexes: [
          {
              unique: true,
              fields: ['description', 'typeId', 'targetId'],
              msg: "Task already exists."
          }
      ]
   });
    return Task;
  };