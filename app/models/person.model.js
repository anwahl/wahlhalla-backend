/**
 * A Person
 * @typedef {object} Person
 * @property {string} firstName.required - First Name
 * @property {string} lastName.required - Last Name
 * @property {string} email - email
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