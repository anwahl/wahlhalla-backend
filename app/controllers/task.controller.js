
const { validationResult } = require('express-validator');
const db = require("../models");
const Target = db.targets;
const TaskType = db.taskTypes;
const Task = db.tasks;
const Op = db.Sequelize.Op;

module.exports = class TaskController {

    /**
     * @swagger
     * tags:
     *   - name: Task
     *     description: An entity that is designed to be reuasable for reassignment of tasks.
     */
    constructor() {
     }

     findAll = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        Task.findAll({include: [{
                        model: TaskType,
                        required: true
                            }, {
                        model: Target,
                        required: true
                            }],
            order: [ [ 'description', 'ASC' ]]})
            .then(data => {
                res.send(data);
            })
            .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving task."
            });
        });
    };
        
    findOne = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id;
        Task.findByPk(id, { include: [{
                        model: TaskType,
                        required: true
                            }, {
                        model: Target,
                        required: true
                        }]})
        .then(data => {
            if (data) {
            res.send(data);
            } else {
            res.status(404).send({
                message: `Cannot find task with id=${id}.`
            });
            }
        })
        .catch(err => {
            res.status(500).send({
            message: "Error retrieving task with id=" + id
            });
        });
    };
    
    update = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id;
        const task = req.body;
        Task.count({
            where: {description: task.description, typeId: task.typeId, targetId: task.targetId, id: {[Op.ne]: id}}
        })
        .then(num => {
            if (num> 0) {
                res.send({message: 'Task already exists.'});
            } else {
                Task.update(req.body, {
                where: { id: id }
                })
                .then(num => {
                    if (num == 1) {
                        res.send({
                            success: true,
                            message: "Task was updated successfully."
                        });
                    } else {
                        res.send({
                            message: `Cannot update task with id=${id}. Maybe task was not found or req.body is empty!`
                        });
                    }
                })
                .catch(err => {
                    res.status(500).send({
                    message: "Error updating task with id=" + id
                    });
                });
            }
        })
        .catch(err => {
            res.send({message: "Some error occurred while retrieving Task. " + err });
        });
    };
        
    delete = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const id = req.params.id;
        Task.destroy({
        where: { id: id }
        })
        .then(num => {
            if (num == 1) {
            res.send({
                success: true,
                message: "Task was deleted successfully!"
            });
            } else {
            res.send({
                message: `Cannot delete task with id=${id}. Maybe task was not found!`
            });
            }
        })
        .catch(err => {
            res.status(500).send({
            message: "Could not delete task with id=" + id
            });
        });
    };


    create = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const task = {
            description: req.body.description,
            typeId: req.body.typeId,
            targetId: req.body.targetId,
            value: req.body.value
        };
        Task.count({
            where: {description: task.description, typeId: task.typeId, targetId: task.targetId}
        })
        .then(num => {
            if (num> 0) {
                res.send({message: 'Task already exists.'});
            } else {
                
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
            }
        })
        .catch(err => {
            res.send({message: "Some error occurred while retrieving Tasks. " + err });
        });
    };

    findByType= (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const type = req.params.typeId;
        var condition = { typeId:  type };
        Task.findAll({ where: condition, include: [{
                                            model: TaskType,
                                            required: true
                                                }, {
                                            model: Target,
                                            required: true
                                                }],
                                                order: [ [ 'description', 'ASC' ]]})
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

    findByTargetAndType= (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const type = req.params.typeId;
        const target = req.params.targetId;
        var condition = { typeId:  type, targetId: target };
        Task.findAll({ where: condition, include: [{
                                            model: TaskType,
                                            required: true
                                                }, {
                                            model: Target,
                                            required: true
                                                }],
                                                order: [ [ 'description', 'ASC' ]]})
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

        const description = req.params.description;
        var condition = description ? { description: { [Op.like]: `%${description}%` } } : null;
        Task.findAll({ where: condition, include: [{
                                        model: TaskType,
                                        required: true
                                            }, {
                                        model: Target,
                                        required: true
                                            }],
                                            order: [ [ 'description', 'ASC' ]]})
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

        const target = req.params.targetId;
        var condition = { targetId: target };
        Task.findAll({ where: condition, include: [{
            model: TaskType,
            required: true
                }, {
                    model: Target,
                    required: true
                        }],
                        order: [ [ 'description', 'ASC' ]]})
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