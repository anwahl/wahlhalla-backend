/**
 * @swagger
 * components:
 *   schemas:
 *     TaskType:
 *       type: object
 *       description: Entity with a description and category.
 *       properties:
 *         id:
 *           type: integer
 *           description: ID of the task type.
 *           example: 10
 *         description:
 *           type: string
 *           description: The task type's description.
 *           example: task type description
 *         category:
 *           type: enum
 *           description: The category of the task type. In [CHORE, BILL, APPOINTMENT, LIST, OTHER].
 *           example: APPOINTMENT
 *         createdAt:
 *           type: date
 *           description: The date the task type was created.
 *           example: 2023-01-01T01:13:51.000Z
 *         updatedAt:
 *           type: date
 *           description: The date the task type was updated.
 *           example: 2023-01-01T01:13:51.000Z               
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