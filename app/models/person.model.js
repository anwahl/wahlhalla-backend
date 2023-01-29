/**
 * @swagger
 * components:
 *   schemas:
 *     Person:
 *       type: object
 *       description: Entity with a first name, last name, and email. Uniqueness defined by first and last name.
 *       properties:
 *         firstName:
 *           type: string
 *           description: The person's first name.
 *           example: Annie
 *         lastName:
 *           type: string
 *           description: The person's last name.
 *           example: Wahl
 *         email:
 *           type: string
 *           description: The person's email.
 *           example: admin@wahlhalla.com
 *       required:
 *         - firstName
 *         - lastName
 */

module.exports = (sequelize, Sequelize) => {
    const Person = sequelize.define("person", {
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING
      }
    },
    {
      indexes: [
          {
              unique: true,
              fields: ['firstName', 'lastName'],
              msg: "Person already exists."
          }
      ]
   });
    return Person;
  };