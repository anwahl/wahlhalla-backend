
const { validationResult } = require('express-validator');
const db = require("../models");
const ObjectController = require("./object.controller.js");
const TaskType = db.taskTypes;
const Op = db.Sequelize.Op;

module.exports = class TaskTypeController extends ObjectController {
    constructor(taskType) {
        super(taskType);
     }

    create = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const taskType = {
            task: req.body.task,
            type: req.body.type
        };
        TaskType.create(taskType)
        .then(data => {
        res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the TaskType."
        });
        });
    };

    findByCategory = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const category = req.query.category;
        var condition = category ? { category: { [Op.eq]: category } } : null;
        TaskType.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving TaskType."
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
        TaskType.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving TaskType."
            });
        });
    };
}