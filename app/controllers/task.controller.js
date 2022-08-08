
const { validationResult } = require('express-validator');
const db = require("../models");
const ObjectController = require("./object.controller.js");
const Task = db.tasks;
const Op = db.Sequelize.Op;

module.exports = class TaskController extends ObjectController {
    constructor(task) {
        super(task);
     }

    create = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const task = {
            name: req.body.name,
            type: req.body.type,
            target: req.body.target,
            value: req.body.value
        };
        Task.create(task)
        .then(data => {
        res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Task."
        });
        });
    };

    findByType= (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const type = req.query.type;
        var condition = type ? { type: { [Op.eq]: type } } : null;
        Task.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Tasks."
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
        Task.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Tasks."
            });
        });
    };

    findByTarget= (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const type = req.query.type;
        var condition = target ? { target: { [Op.eq]: target } } : null;
        Task.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Tasks."
            });
        });
    };
}