module.exports = app => {
    const TargetType = require("../controllers/targetType.controller.js");
    const validator = require("../validators/validator");
    var router = require("express").Router();
    const db = require("../models");
    const _targetType = db.persons;
    var targetType = new TargetType(_targetType);

    router.get("/", targetType.findAll);
    router.post("/",  validator.validateTargetType, targetType.create);
    router.get("/:id", validator.validateID, targetType.findOne);
    router.put("/:id", validator.validateID, validator.validateTargetType, targetType.update);
    router.delete("/:id", validator.validateID, targetType.delete);
    router.get("/description/:description", validator.validateDescription, targetType.findByDescription);
    app.use('/api/targetType', router);
}