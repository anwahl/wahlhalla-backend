
const { validationResult } = require('express-validator');
const db = require("../models");
const ObjectController = require("./object.controller.js");
const TargetType = db.targetTypes;
const Op = db.Sequelize.Op;

module.exports = class TargetTypeController extends ObjectController {
    constructor(targetType) {
        super(targetType);
     }

    create = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const targetType = {
            name: req.body.name
        };
        TargetType.create(targetType)
        .then(data => {
        res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the TargetType."
        });
        });
    };

    findByDescription = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const description = req.query.description;
        var condition = description ? { description: { [Op.like]: `%${description}%` } } : null;
        TargetType.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving TargetType."
            });
        });
    };
}