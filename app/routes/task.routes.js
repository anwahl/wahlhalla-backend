module.exports = app => {
    const Task = require("../controllers/task.controller.js");
    const validator = require("../validators/validator");
    var router = require("express").Router();
    const db = require("../models");
    const _task = db.persons;
    var task = new Task(_task);

    router.get("/", task.findAll);
    router.post("/",  validator.validateTask, task.create);
    router.get("/:id", validator.validateID, task.findOne);
    router.put("/:id", validator.validateID, validator.validateTask, task.update);
    router.delete("/:id", validator.validateID, task.delete);
    router.get("/type/:type", validator.validateTypeID, task.findByType);
    router.get("/description/:description", validator.validateDescription, task.findByDescription);
    router.get("/target/:target", validator.validateTargetID, task.findByTarget);
    app.use('/api/task', router);
};