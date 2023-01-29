module.exports = app => {
    const AssignedTask = require("../controllers/assignedTask.controller.js");
    const validator = require("../validators/validator");
    var router = require("express").Router();
    var assignedTask = new AssignedTask();

    router.get("/", assignedTask.findAll);
    router.post("/",  validator.validateAssignedTask, assignedTask.create);
    router.get("/:id", validator.validateID, assignedTask.findOne);
    router.put("/:id", validator.validateID, validator.validateAssignedTask, assignedTask.update);
    router.put("/series/:id", validator.validateID, validator.validateAssignedTask, assignedTask.updateAllInSeries);
    router.delete("/:id", validator.validateID, assignedTask.delete);
    router.delete("/series/:id", validator.validateID, assignedTask.deleteAllInSeries);
    router.get("/person/:personId", validator.validatePersonID, assignedTask.findByPerson);
    router.get("/type/:type", validator.validateAssignedTaskType, assignedTask.findByType);
    router.get("/completion/:complete",  validator.validateCompletion, assignedTask.findByCompletion);
    router.get("/dueDate/:dueDate",  validator.validateDueDate, assignedTask.findByDueDate);
    router.get("/que/ry/", validator.validateAssignedTaskQuery, assignedTask.findByQuery);
    router.get("/category/:category", validator.validateAssignedTaskCategory, assignedTask.findByCategory);
    app.use('/api/assignedTask', router);
};