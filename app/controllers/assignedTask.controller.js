
const { validationResult } = require('express-validator');
const dateFunc = require('date-and-time');
const db = require("../models");
const Task = db.tasks;
const Target = db.targets;
const TaskType = db.taskTypes;
const Person = db.persons;
const AssignedTask = db.assignedTasks;
const Op = db.Sequelize.Op;
const url = require('url');
const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

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
                                required: false
                                    }],
                                    order: [ [ 'dueDate', 'DESC' ]]})
            .then(data => {
                res.send(data);
            })
            .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving Assigned Task."
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
                                required: false
                                    }]})
        .then(data => {
            if (data) {
            res.send(data);
            } else {
            res.status(404).send({
                message: `Cannot find Assigned Task with id=${id}.`
            });
            }
        })
        .catch(err => {
            res.status(500).send({
            message: "Error retrieving Assigned Task with id=" + id
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
        where: { id: id }  })
        .then(num => {
            if (num == 1) {
                if (req.body.complete) {
                    if (process.env.NODE_ENV === 'production') {
                        let date = new Date();
                        let time = (date.getHours() < 16 ? '0' : '') + (date.getHours() - 6) + ':' + (date.getMinutes() < 10 ? '0' : '') + (date.getMinutes());
                        date = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? (date.getDate()) : ('0' + (date.getDate()))) + '/' + date.getFullYear();
                        var message = `"${req.body.task.description}" has been marked complete on ${date} at ${time}.`;
                        process.env.TO_NUMBER.split(',').forEach(num => {
                            twilio.messages.create({
                            body: message,
                            from: process.env.FROM_NUMBER,
                            to: num
                            }).then(message => console.log(message.body));
                        });
                    }
                }
                if (req.body.complete == true && req.body.type != 'STANDALONE' && (req.body.occurrences == 0 || req.body.occurrences == null)) {
                    AssignedTask.findAll({
                        limit: 1,
                        where: {
                            personId: req.body.personId,
                            taskId: req.body.taskId,
                            type: req.body.type,
                            timeOfDay: req.body.timeOfDay,
                            endTimeOfDay: req.body.endTimeOfDay,
                            occurrences: req.body.occurrences
                        },
                        order: [ [ 'dueDate', 'DESC' ]]
                    })
                    .then(data => {
                        let newDate = new Date();
                        if (req.body.type == 'DAILY') {
                            newDate = dateFunc.addHours(dateFunc.addDays(new Date(data[0]['dataValues'].dueDate), 1), 6);
                        } else if (req.body.type == 'WEEKLY') {
                            newDate = dateFunc.addHours(dateFunc.addDays(new Date(data[0]['dataValues'].dueDate), 7), 6);
                        } else if (req.body.type == 'BIWEEKLY') {
                            newDate = dateFunc.addHours(dateFunc.addDays(new Date(data[0]['dataValues'].dueDate), 14), 6);
                        } else if (req.body.type == 'MONTHLY') {
                            newDate = dateFunc.addHours(dateFunc.addMonths(new Date(data[0]['dataValues'].dueDate), 1), 6);
                        } else if (req.body.type == 'YEARLY') {
                            newDate = dateFunc.addHours(dateFunc.addYears(new Date(data[0]['dataValues'].dueDate), 1), 6);
                        }
                        const assignedTask = {
                            personId: req.body.personId,
                            taskId: req.body.taskId,
                            type: req.body.type,
                            timeOfDay: req.body.timeOfDay,
                            endTimeOfDay: req.body.endTimeOfDay,
                            dueDate: newDate,
                            occurrences: req.body.occurrences,
                            complete: false
                        };
                        AssignedTask.create(assignedTask)
                        .then(data => {
                            if (!res.headersSent) {
                                res.send(data);
                            }
                        })
                        .catch(err => {
                            if (!res.headersSent) {
                                res.status(500).send({
                                message: "Error creating Assigned Task."
                            });
                            }
                    });
                    }).catch(err => {
                        if (!res.headersSent) {
                                res.status(500).send({
                                message: "Error finding Assigned Tasks."
                            });
                        }
                    });
                }

            if (!res.headersSent) {
                res.send({
                    success: true,
                    message: "Assigned Task was updated successfully."
                });
            }
            } else {
                if (!res.headersSent) {
                    res.send({
                        message: `Cannot update Assigned Task with id=${id}. Maybe Assigned Task was not found or req.body is empty!`
                    });
                }
            }
        })
        .catch(err => {
            if (!res.headersSent) {
                res.status(500).send({
                message: "Error updating Assigned Task with id=" + id + err
                });
            }
        });
    };

    updateAllInSeries = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id;
        AssignedTask.findByPk(id)
        .then(data => {
            let values = {
                personId: req.body.personId,
                taskId: req.body.taskId,
                type: req.body.type,
                timeOfDay: req.body.timeOfDay,
                endTimeOfDay: req.body.endTimeOfDay,
                occurrences: req.body.occurrences,
                complete: req.body.complete
            }
            AssignedTask.update(values, {
                where: {
                    personId: data['dataValues']['personId'],
                    taskId: data['dataValues']['taskId'],
                    type: data['dataValues']['type'],
                    timeOfDay: data['dataValues']['timeOfDay'],
                    endTimeOfDay: data['dataValues']['endTimeOfDay'],
                    occurrences: data['dataValues']['occurrences']
                }
                
            })
            .then(num => {
                if (num >= 1) {
                    if (req.body.complete) {
                        if (process.env.NODE_ENV === 'production') {
                            let date = new Date();
                            let time = (date.getHours() < 16 ? '0' : '') + (date.getHours() - 6) + ':' + (date.getMinutes() < 10 ? '0' : '') + (date.getMinutes());
                            date = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? (date.getDate()) : ('0' + (date.getDate()))) + '/' + date.getFullYear();
                            var message = `The "${req.body.task.description}" series has been marked complete on ${date} at ${time}.`;
                            
                            process.env.TO_NUMBER.split(',').forEach(num => {
                                twilio.messages.create({
                                body: message,
                                from: process.env.FROM_NUMBER,
                                to: num
                                }).then(message => console.log(message.body));
                            });
                        }
                    }
                    if (!res.headersSent) {
                        res.send({
                            success: true,
                            message: "Assigned Task was updated successfully."
                        });
                    }
                } else {
                    if (!res.headersSent) {
                        res.send({
                            message: `Cannot update Assigned Task with id=${id}. Maybe Assigned Task was not found or req.body is empty!`
                        });
                    }
                }
            })
            .catch(err => {
                if (!res.headersSent) {
                    res.status(500).send({
                    message: "Error updating Assigned Task with id=" + id + ". " + err
                    });
                }
            });  
        })
        .catch(err => {
            if (!res.headersSent) {
                res.status(500).send({
                message: "Error finding Assigned Task with id=" + id + ". " + err
                });
            }
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
                    success: true,
                    message: "Assigned Task was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Assigned Task with id=${id}. Maybe Assigned Task was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
            message: "Could not delete Assigned Task with id=" + id
            });
        });
    };

    
    deleteAllInSeries = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const id = req.params.id;
        AssignedTask.findByPk(id)
        .then(data => {
            AssignedTask.destroy({
                where: {
                    personId: data['dataValues'].personId,
                    taskId: data['dataValues'].taskId,
                    type: data['dataValues'].type,
                    timeOfDay: data['dataValues'].timeOfDay,
                    endTimeOfDay: data['dataValues'].endTimeOfDay,
                    occurrences: data['dataValues'].occurrences
                }
            })
            .then(num => {
                if (num > 0) {
                res.send({
                    success: true,
                    message: "Assigned Tasks were deleted successfully!"
                });
                } else {
                res.send({
                    message: `Cannot delete Assigned Task with id=${id}. Maybe Assigned Task was not found!`
                });
                }
            })
            .catch(err => {
                res.status(500).send({
                message: "Could not delete Assigned Task with id=" + id
                });
            });
        })
        .catch(err => {
            res.status(500).send({
            message: "Could not delete Assigned Task with id=" + id
            });
        })
        
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
            occurrences: req.body.occurrences,
            complete: req.body.complete
        };
        AssignedTask.create(assignedTask)
        .then(data => {
            if (data.type != 'STANDALONE') {
                let occurrences = 0, newDate = new Date(), assignedTasks = [];
                if (data.occurrences > 0) {
                    occurrences = data.occurrences - 1;
                } else {
                    occurrences = 30;
                }
                for (let i = 1; i <= occurrences; i++) {
                    if (data.type == 'DAILY') {
                        newDate = dateFunc.addHours(dateFunc.addDays(new Date(data.dueDate), (1 * i)), 6);
                    } else if (data.type == 'WEEKLY') {
                        newDate = dateFunc.addHours(dateFunc.addDays(new Date(data.dueDate), (7 * i)), 6);
                    } else if (req.body.type == 'BIWEEKLY') {
                        newDate = dateFunc.addHours(dateFunc.addDays(new Date(data.dueDate), (14 * i)), 6);
                    } else if (data.type == 'MONTHLY') {
                        newDate = dateFunc.addHours(dateFunc.addMonths(new Date(data.dueDate), 1 * i), 6);
                    } else if (data.type == 'YEARLY') {
                        newDate = dateFunc.addHours(dateFunc.addYears(new Date(data.dueDate), 1 * i), 6);
                    }
                    
                    assignedTasks.push({
                        personId: data.personId,
                        taskId: data.taskId,
                        type: data.type,
                        timeOfDay: data.timeOfDay,
                        endTimeOfDay: data.endTimeOfDay,
                        dueDate: newDate,
                        occurrences: data.occurrences,
                        complete: false
                    });
                }
                AssignedTask.bulkCreate(assignedTasks)
                .then(data => {
                    if (!res.headersSent) {
                        res.send(data);
                    }
                })
                .catch(err => {
                    if (!res.headersSent) {
                        res.status(500).send({
                            message:
                            err.message || "Some error occurred while creating the Assigned Tasks."
                        });
                    }
                });
            }
            if (!res.headersSent) {
                res.send(data);
            }
        })
        .catch(err => {
            if (!res.headersSent) {
                res.status(500).send({
                    message:
                    err.message || "Some error occurred while creating the Assigned Tasks."
                });
            }
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
                                required: false
                                    }]})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Assigned Tasks."
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
        AssignedTask.findAll({ where: condition, include: [{
                                model: Task,
                                required: true, include: [{
                                    model: Target,
                                    required: true
                                    }]}, {
                                model: Person,
                                required: false
                                    }], 
                                    order: [ [ 'dueDate', 'DESC' ]]})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Assigned Tasks."
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
        AssignedTask.findAll({ where: condition, include: [{
                                model: Task,
                                required: true, include: [{
                                    model: Target,
                                    required: true
                                    }]}, {
                                model: Person,
                                required: false
                                    }], 
                                    order: [ [ 'dueDate', 'DESC' ]]})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Assigned Tasks."
            });
        });
    };

    findByDueDate = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const dueDate = req.params.dueDate;
        var condition = { dueDate: dueDate};
        AssignedTask.findAll({ where: condition, include: [{
                                model: Task,
                                required: true, include: [{
                                    model: Target,
                                    required: true
                                    }]}, {
                                model: Person,
                                required: false
                                    }], 
                                    order: [ [ 'dueDate', 'DESC' ]]})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Assigned Tasks."
            });
        });
    };

    findByDueDateAndcomplete = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const dueDate = req.params.dueDate;
        const complete = req.params.complete;
        var condition = { dueDate: dueDate, complete: complete };
        AssignedTask.findAll({ where: condition, include: [{
                                model: Task,
                                required: true, include: [{
                                    model: Target,
                                    required: true
                                    }]}, {
                                model: Person,
                                required: false
                                    }],
                                    order: [ [ 'dueDate', 'DESC' ]]})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Assigned Tasks."
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

        AssignedTask.findAll({ where: condition, include: [{
                                model: Task,
                                required: true, include: [{
                                    model: Target,
                                    required: true
                                    }]}, {
                                model: Person,
                                required: false
                                    }],
                                    order: [ [ 'dueDate', 'DESC' ]]})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Assigned Tasks."
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
                required: false
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
                                    required: false
                                        }],
                                        order: [ [ 'dueDate', 'DESC' ]]};
        }
        AssignedTask.findAll(findBy)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Assigned Tasks."
            });
        });
    };
}