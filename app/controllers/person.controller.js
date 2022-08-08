
const { validationResult } = require('express-validator');
const db = require("../models");
const Person = db.persons;
const ObjectController = require("./object.controller.js");
const Op = db.Sequelize.Op;

module.exports = class PersonController extends ObjectController {
    constructor(person) {
        super(person);
     }
     
    create = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const person = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
        };
        Person.create(person)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while creating the Person."
        });
        });
    };

    findByName = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        const name = req.query.name;
        var condition = name ? { name: { [Op.or]: [
                        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('firstName')), 'LIKE', `%${name}%`),
                        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('lastName')), 'LIKE', `%${name}%`),
                    ] } } : null;
        Person.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving People."
            });
        });
    };
}
