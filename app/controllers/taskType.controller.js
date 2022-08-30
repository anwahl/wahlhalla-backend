
const { validationResult } = require('express-validator');
const db = require("../models");
const TaskType = db.taskTypes;
const Op = db.Sequelize.Op;

module.exports = class TaskTypeController {
    constructor() {
     }

     findAll = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        TaskType.findAll({order: [ [ 'description', 'ASC' ]]})
            .then(data => {
                res.send(data);
            })
            .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving taskType."
            });
        });
    };
        
    findOne = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id;
        TaskType.findByPk(id)
        .then(data => {
            if (data) {
            res.send(data);
            } else {
            res.status(404).send({
                message: `Cannot find taskType with id=${id}.`
            });
            }
        })
        .catch(err => {
            res.status(500).send({
            message: "Error retrieving taskType with id=" + id
            });
        });
    };
    
    update = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params.id;
        const taskType = {
            description: req.body.description,
            category: req.body.category
        };
        TaskType.count({
            where: {description: taskType.description, category: taskType.category, id: {[Op.ne]: id}}
        })
        .then(num => {
            if (num> 0) {
                res.send({message: 'Task Type already exists.'});
            } else {
                const id = req.params.id;
                TaskType.update(req.body, {
                where: { id: id }
                })
                .then(num => {
                    if (num == 1) {
                        res.send({
                            success: true,
                            message: "Task Type was updated successfully."
                        });
                    } else {
                        res.send({
                            message: `Cannot update taskType with id=${id}. Maybe Task Type was not found or req.body is empty!`
                        });
                    }
                })
                .catch(err => {
                    res.status(500).send({
                    message: "Error updating Task Type with id=" + id
                    });
                });
            }
        })
        .catch(err => {
            res.send({message: "Some error occurred while retrieving Task Type. " + err });
        });
    };
        
    delete = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const id = req.params.id;
        TaskType.destroy({
        where: { id: id }
        })
        .then(num => {
            if (num == 1) {
            res.send({
                success: true,
                message: "TaskType was deleted successfully!"
            });
            } else {
            res.send({
                message: `Cannot delete taskType with id=${id}. Maybe taskType was not found!`
            });
            }
        })
        .catch(err => {
            res.status(500).send({
            message: "Could not delete taskType with id=" + id
            });
        });
    };


    create = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const taskType = {
            description: req.body.description,
            category: req.body.category
        };
        TaskType.count({
            where: {description: taskType.description, category: taskType.category}
        })
        .then(num => {
            if (num> 0) {
                res.send({message: 'Task Type already exists.'});
            } else {
                const taskType = {
                    description: req.body.description,
                    category: req.body.category
                };
                TaskType.create(taskType)
                .then(data => {
                res.send(data);
                })
                .catch(err => {
                res.status(500).send({
                        message:
                        err.message || "Some error occurred while creating the Task Type."
                    });
                });
            }
        })
        .catch(err => {
            res.send({message: "Some error occurred while retrieving Task Type. " + err });
        });
    };

    findByCategory = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const category = req.params.category;
        var condition = category ? { category: { [Op.eq]: category } } : null;
        TaskType.findAll({ where: condition, order: [ [ 'description', 'ASC' ]] })
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

        const description = req.params.description;
        var condition = description ? { description: { [Op.like]: `%${description}%` } } : null;
        TaskType.findAll({ where: condition, order: [ [ 'description', 'ASC' ]] })
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