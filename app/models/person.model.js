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
    });
    return Person;
  };