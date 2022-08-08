module.exports = app => {
    const Subtask = require("../controllers/subtask.controller.js");
    const validator = require("../validators/validator");
    var router = require("express").Router();
    const db = require("../models");
    const _subtask = db.persons;
    var subtask = new Subtask(_subtask);

    router.get("/", subtask.findAll);
    router.post("/",  validator.validateSubtask, subtask.create);
    router.get("/:id", validator.validateID, subtask.findOne);
    router.put("/:id", validator.validateID, validator.validateSubtask, subtask.update);
    router.delete("/:id", validator.validateID, subtask.delete);
    router.get("/task/:task", validator.validateName, subtask.findByTask);
    router.get("/description/:description", validator.validateName, subtask.findByDescription);
    app.use('/api/subtask', router);
};