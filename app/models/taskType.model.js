/**
 * @swagger
 * components:
 *   schemas:
 *     TaskType:
 *       type: object
 *       description: Entity with a description and category.
 *       properties:
 *         description:
 *           type: string
 *           description: The task type's description.
 *           example: task type description
 *         category:
 *           type: enum
 *           description: The category of the task type. In [CHORE, BILL, APPOINTMENT, LIST, OTHER].
 *           example: APPOINTMENT
 *       required:
 *         - description
 *         - category
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