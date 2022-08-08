module.exports = app => {
    const TaskType = require("../controllers/taskType.controller.js");
    const validator = require("../validators/validator");
    var router = require("express").Router();
    const db = require("../models");
    const _taskType = db.persons;
    var taskType = new TaskType(_taskType);

    router.get("/", taskType.findAll);
    router.post("/",  validator.validateTaskType, taskType.create);
    router.get("/:id", validator.validateID, taskType.findOne);
    router.put("/:id", validator.validateID, validator.validateTaskType, taskType.update);
    router.delete("/:id", validator.validateID, taskType.delete);
    router.get("/description/:description", validator.validateDescription, taskType.findByDescription);
    router.get("/category/:category", validator.validateTaskCategory, taskType.findByCategory);
    app.use('/api/taskType', router);
}