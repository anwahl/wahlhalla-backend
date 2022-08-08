
const { validationResult } = require('express-validator');
const db = require("../models");
const ObjectController = require("./object.controller.js");
const Subtask = db.Subtask;
const Op = db.Sequelize.Op;

module.exports = class SubtaskController extends ObjectController {
    constructor(subtask) {
        super(subtask);
     }

    create = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const subtask = {
            name: req.body.name,
            task: req.body.task
        };
        Subtask.create(subtask)
        .then(data => {
        res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Subtask."
        });
        });
    };

    findByTask= (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const task = req.query.task;
        var condition = task ? { task: { [Op.like]: `%${task}%` } } : null;
        Subtask.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Subtask."
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
        Subtask.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Subtasks."
            });
        });
    };
}