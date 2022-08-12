
const { validationResult } = require('express-validator');
const db = require("../models");
const Task = db.tasks;
const AssignedTask = db.assignedTasks;
const Subtask = db.subtasks;
const Op = db.Sequelize.Op;

module.exports = class SubtaskController {
    constructor() {
     }

     findAll = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        Subtask.findAll({include: [{
                            model: AssignedTask,
                            required: true, include: [{
                                model: Task,
                                required: true
                                }]}]})
            .then(data => {
                res.send(data);
            })
            .catch(err =>                 {
            res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving subtask."
            });
        });
    };
        
    findOne = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id;
        Subtask.findByPk(id, {include: [{
                            model: AssignedTask,
                            required: true, include: [{
                                model: Task,
                                required: true
                                }]}]})
        .then(data => {
            if (data) {
            res.send(data);
            } else {
            res.status(404).send({
                message: `Cannot find subtask with id=${id}.`
            });
            }
        })
        .catch(err => {
            res.status(500).send({
            message: "Error retrieving subtask with id=" + id
            });
        });
    };
    
    update = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id;
        Subtask.update(req.body, {
        where: { id: id }
        })
        .then(num => {
            if (num == 1) {
            res.send({
                message: "Subtask was updated successfully."
            });
            } else {
            res.send({
                message: `Cannot update subtask with id=${id}. Maybe subtask was not found or req.body is empty!`
            });
            }
        })
        .catch(err => {
            res.status(500).send({
            message: "Error updating subtask with id=" + id
            });
        });
    };
        
    delete = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const id = req.params.id;
        Subtask.destroy({
        where: { id: id }
        })
        .then(num => {
            if (num == 1) {
            res.send({
                message: "Subtask was deleted successfully!"
            });
            } else {
            res.send({
                message: `Cannot delete subtask with id=${id}. Maybe subtask was not found!`
            });
            }
        })
        .catch(err => {
            res.status(500).send({
            message: "Could not delete subtask with id=" + id
            });
        });
    };

    create = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const subtask = {
            description: req.body.description,
            assignedTaskId: req.body.assignedTaskId
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

        const assignedTaskId = req.params.assignedTaskId;
        var condition = assignedTaskId ? { assignedTaskId: { [Op.like]: assignedTaskId } } : null;
        Subtask.findAll({ where: condition }, {include: [{
                            model: AssignedTask,
                            required: true, include: [{
                                model: Task,
                                required: true
                                }]}]})
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

        const description = req.params.description;
        var condition = description ? { description: { [Op.like]: `%${description}%` } } : null;
        Subtask.findAll({ where: condition }, {include: [{
                            model: AssignedTask,
                            required: true, include: [{
                                model: Task,
                                required: true
                                }]}]})
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