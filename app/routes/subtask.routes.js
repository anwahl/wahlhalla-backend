module.exports = app => {
    const Subtask = require("../controllers/subtask.controller.js");
    const validator = require("../validators/validator");
    var router = require("express").Router();
    var subtask = new Subtask();

    router.get("/", subtask.findAll);
    router.post("/",  validator.validateSubtask, subtask.create);
    router.get("/:id", validator.validateID, subtask.findOne);
    router.put("/:id", validator.validateID, validator.validateSubtask, subtask.update);
    router.delete("/:id", validator.validateID, subtask.delete);
    router.get("/assignedTask/:assignedTaskId", validator.validateAssignedTaskID, subtask.findByAssignedTask);
    router.get("/description/:description", validator.validateName, subtask.findByDescription);
    router.get("/assignedTask/:assignedTaskId/description/:description", validator.validateSubtask, subtask.findByTaskAndDescription);
    app.use('/api/subtask', router);
};