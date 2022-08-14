
const { validationResult } = require('express-validator');
const db = require("../models");
const Task = db.tasks;
const Target = db.targets;
const TaskType = db.taskTypes;
const Person = db.persons;
const AssignedTask = db.assignedTasks;
const Op = db.Sequelize.Op;
const url = require('url');

module.exports = class AssignedTaskController {
    constructor() {

     }

     findAll = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        AssignedTask.findAll({include: [{
                                model: Task,
                                required: true, include: [{
                                    model: Target,
                                    required: true
                                    }]}, {
                                model: Person,
                                required: true
                                    }]})
            .then(data => {
                res.send(data);
            })
            .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving assignedTask."
            });
        });
    };
        
    findOne = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id;
        AssignedTask.findByPk(id, {include: [{
                                model: Task,
                                required: true, include: [{
                                    model: Target,
                                    required: true
                                    }]}, {
                                model: Person,
                                required: true
                                    }]})
        .then(data => {
            if (data) {
            res.send(data);
            } else {
            res.status(404).send({
                message: `Cannot find assignedTask with id=${id}.`
            });
            }
        })
        .catch(err => {
            res.status(500).send({
            message: "Error retrieving assignedTask with id=" + id
            });
        });
    };
    
    update = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id;
        AssignedTask.update(req.body, {
        where: { id: id }
        })
        .then(num => {
            if (num == 1) {
            res.send({
                message: "AssignedTask was updated successfully."
            });
            } else {
            res.send({
                message: `Cannot update assignedTask with id=${id}. Maybe assignedTask was not found or req.body is empty!`
            });
            }
        })
        .catch(err => {
            res.status(500).send({
            message: "Error updating assignedTask with id=" + id
            });
        });
    };
        
    delete = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const id = req.params.id;
        AssignedTask.destroy({
        where: { id: id }
        })
        .then(num => {
            if (num == 1) {
            res.send({
                message: "AssignedTask was deleted successfully!"
            });
            } else {
            res.send({
                message: `Cannot delete assignedTask with id=${id}. Maybe assignedTask was not found!`
            });
            }
        })
        .catch(err => {
            res.status(500).send({
            message: "Could not delete assignedTask with id=" + id
            });
        });
    };


    create = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const assignedTask = {
            personId: req.body.personId,
            taskId: req.body.taskId,
            type: req.body.type,
            timeOfDay: req.body.timeOfDay,
            endTimeOfDay: req.body.endTimeOfDay,
            dueDate: req.body.dueDate,
            complete: req.body.complete
        };
        AssignedTask.create(assignedTask)
        .then(data => {
        res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the AssignedTask."
        });
        });
    };

    findByPerson = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).jsonf({ errors: errors.array() });
        }7

        const person = req.params.person;
        var condition = person ? { person: { [Op.eq]: person } } : null;
        AssignedTask.findAll({ where: condition }, {include: [{
                                model: Task,
                                required: true, include: [{
                                    model: Target,
                                    required: true
                                    }]}, {
                                model: Person,
                                required: true
                                    }]})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving AssignedTasks."
            });
        });
    };
    
    findByType = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).jsonf({ errors: errors.array() });
        }7

        const person = req.params.person;
        var type = person ? { type: { [Op.eq]: type } } : null;
        AssignedTask.findAll({ where: condition }, {include: [{
                                model: Task,
                                required: true, include: [{
                                    model: Target,
                                    required: true
                                    }]}, {
                                model: Person,
                                required: true
                                    }]})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving AssignedTasks."
            });
        });
    };

    findByCompletion = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const complete = req.params.complete;
        var condition = complete ? { complete: { [Op.eq]: complete } } : null;
        AssignedTask.findAll({ where: condition }, {include: [{
                                model: Task,
                                required: true, include: [{
                                    model: Target,
                                    required: true
                                    }]}, {
                                model: Person,
                                required: true
                                    }]})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving AssignedTasks."
            });
        });
    };

    findByDueDate = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const dueDate = req.params.dueDate;
        var condition = dueDate ? { dueDate: { [Op.eq]: dueDate } } : null;
        AssignedTask.findAll({ where: condition }, {include: [{
                                model: Task,
                                required: true, include: [{
                                    model: Target,
                                    required: true
                                    }]}, {
                                model: Person,
                                required: true
                                    }]})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving AssignedTasks."
            });
        });
    };

    
    findByQuery = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const dueDate = url.parse(req.url, true).query.dueDate;
        const complete = url.parse(req.url, true).query.complete;
        const type = url.parse(req.url, true).query.type;
        const person = url.parse(req.url, true).query.person;
        
        var condition = {
            [Op.and]: [
                dueDate ? { dueDate: dueDate } : null,
                complete ? { complete: complete } : null,
                type ? { type: type } : null,
                person ? { person: person } : null,
            ]
        };

        AssignedTask.findAll({ where: condition }, {include: [{
                                model: Task,
                                required: true, include: [{
                                    model: Target,
                                    required: true
                                    }]}, {
                                model: Person,
                                required: true
                                    }]})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving AssignedTasks."
            });
        });
    };

    findByCategory = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const category = req.params.category;
        let findBy;
        if (category == 'ASSIGNEDTASK') {
            findBy = {include: [{
                model: Task,
                required: true, include: [{
                    model: Target,
                    required: true
                    },
                    {
                        model: TaskType,
                        required: true
                        }]}, {
                model: Person,
                required: true
                    }]};
        } else {
            var condition = {
                [Op.and]: [
                    category ? { '$task.taskType.category$': category } : null
                ]
            };
            findBy = { where: condition, include: [{
                                    model: Task,
                                    required: true, include: [{
                                        model: Target,
                                        required: true
                                        },
                                        {
                                            model: TaskType,
                                            required: true
                                            }]}, {
                                    model: Person,
                                    required: true
                                        }]};
        }
        AssignedTask.findAll(findBy)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving AssignedTasks."
            });
        });
    };
}