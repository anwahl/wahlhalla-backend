module.exports = app => {
    const Task = require("../controllers/task.controller.js");
    const validator = require("../validators/validator");
    var router = require("express").Router();
    var task = new Task();

    router.get("/", task.findAll);
    router.post("/",  validator.validateTask, task.create);
    router.get("/:id", validator.validateID, task.findOne);
    router.put("/:id", validator.validateID, validator.validateTask, task.update);
    router.delete("/:id", validator.validateID, task.delete);
    router.get("/type/:typeId", validator.validateTypeID, task.findByType);
    router.get("/description/:description", validator.validateDescription, task.findByDescription);
    router.get("/target/:targetId", validator.validateTargetID, task.findByTarget);
    router.get("/targetAndType/:targetId/:typeId", validator.validateTargetAndTypeID, task.findByTargetAndType);
    app.use('/api/task', router);
};