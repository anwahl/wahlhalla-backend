module.exports = app => {
    const Person = require("../controllers/person.controller.js");
    const validator = require("../validators/validator");
    var router = require("express").Router();
    var person = new Person();

    router.get("/", person.findAll);
    router.post("/",  validator.validatePerson, person.create);
    router.get("/:id", validator.validateID, person.findOne);
    router.put("/:id", validator.validateID, validator.validatePerson, person.update);
    router.delete("/:id", validator.validateID, person.delete);
    router.get("/name/:name", validator.validateName, person.findByName);
    app.use('/api/person', router);
  };