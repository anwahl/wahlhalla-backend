const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
      native:true,
    }
  });
/* Heroku Database Connection
const sequelize = new Sequelize(process.env.DB_NAME,
   process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});*/
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.persons = require("./person.model.js")(sequelize, Sequelize);
db.taskTypes = require("./taskType.model.js")(sequelize, Sequelize);
db.targetTypes = require("./targetType.model.js")(sequelize, Sequelize);
db.targets = require("./target.model.js")(sequelize, Sequelize);
db.tasks = require("./task.model.js")(sequelize, Sequelize);
db.assignedTasks = require("./assignedTask.model.js")(sequelize, Sequelize);
db.subtasks = require("./subtask.model.js")(sequelize, Sequelize);

db.targets.belongsTo(db.targetTypes, { foreignKey: "typeId" });

db.tasks.belongsTo(db.targets, { foreignKey: "targetId" });
db.tasks.belongsTo(db.taskTypes, { foreignKey: "typeId" });

db.assignedTasks.belongsTo(db.tasks, { foreignKey: "taskId" });
db.assignedTasks.belongsTo(db.persons, { foreignKey: "personId" });

db.subtasks.belongsTo(db.assignedTasks, { foreignKey: "assignedTaskId" });

module.exports = db;