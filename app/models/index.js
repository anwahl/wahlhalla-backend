const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});
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
module.exports = db;