module.exports = app => {
    const Target = require("../controllers/target.controller.js");
    const validator = require("../validators/validator");
    var router = require("express").Router();
    var target = new Target();

    router.get("/", target.findAll);
    router.post("/",  validator.validateTarget, target.create);
    router.get("/:id", validator.validateID, target.findOne);
    router.put("/:id", validator.validateID, validator.validateTarget, target.update);
    router.delete("/:id", validator.validateID, target.delete);
    router.get("/type/:type", validator.validateTypeID, target.findByType);
    router.get("/description/:description", validator.validateDescription, target.findByDescription);
    app.use('/api/target', router);
};