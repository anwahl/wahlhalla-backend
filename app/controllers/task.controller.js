
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

     /**
      * @swagger
      * /api/task:
      *     get:
      *         tags:
      *           - Task
      *         summary: returns a list of all tasks
      *         description: Retrieves a list of all tasks.
      *         responses:
      *             200:
      *                 description: a list of all tasks ordered by description.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         type: array
      *                         items:
      *                           $ref: '#/components/schemas/Task'
      *             400:
      *                 description: validation error
      *             500:
      *                 description: unknown error
      */
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
    
    /**
      * @swagger
      * /api/task/{id}:
      *     get:
      *         tags:
      *           - Task
      *         summary: returns a task by ID.
      *         description: Retrieves task by ID.
      *         parameters:
      *          - in: path
      *            name: id
      *            required: true
      *            description: Numeric ID of the task to retrieve.
      *            schema:
      *              type: integer
      *         responses:
      *             200:
      *                 description: a task found by specified ID.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         $ref: '#/components/schemas/Task'
      *             400:
      *                 description: validation error
      *             404:
      *                 description: Cannot find task with id={id}.
      *             500:
      *                 description: unknown error
      */
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
    
    /**
      * @swagger
      * /api/task/{id}:
      *     put:
      *         tags:
      *           - Task
      *         summary: updates a task by ID.
      *         description: Updates task by ID.
      *         parameters:
      *          - in: path
      *            name: id
      *            required: true
      *            description: Numeric ID of the task to update.
      *            schema:
      *              type: integer
      *         requestBody:
      *           description: Updated Task
      *           content:
      *             application/json:
      *               schema:
      *                 $ref: '#/components/schemas/Task'
      *         responses:
      *             200:
      *                 description: Task was updated successfully.
      *             400:
      *                 description: validation error
      *             404:
      *                 description: Cannot find task with id={id}.
      *             500:
      *                 description: unknown error
      */
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
    
    /**
      * @swagger
      * /api/task/{id}:
      *     delete:
      *         tags:
      *           - Task
      *         summary: deletes an task by the provided ID.
      *         description: Deletes an task by the provided ID.
      *         parameters:
      *          - in: path
      *            name: id
      *            required: true
      *            description: Numeric ID of the task to delete.
      *            schema:
      *              type: integer
      *         responses:
      *             200:
      *                 description: Task was deleted successfully!
      *             400:
      *                 description: validation error
      *             404:
      *                 description: Cannot delete Task with id={id}. Maybe Task was not found!
      *             500:
      *                 description: Could not delete task with id={id}
      */
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

    /**
      * @swagger
      * /api/task/:
      *     post:
      *         tags:
      *           - Task
      *         summary: creates an task with the provided parameters.
      *         description: Creates an task with the provided parameters
      *         requestBody:
      *            description: Task To Create
      *            required: true
      *            content:
      *              application/json:
      *                schema:
      *                  $ref: '#/components/schemas/Task'
      *         responses:
      *             200:
      *                 description: Returns the newly created task.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         $ref: '#/components/schemas/Task'              
      *             400:
      *                 description: validation error
      *             500:
      *                 description: unknown error
      */
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

    /**
      * @swagger
      * /api/task/type/{typeId}:
      *     get:
      *         tags:
      *           - Task
      *         summary: returns a task by type.
      *         description: Retrieves task by type.
      *         parameters:
      *          - in: path
      *            name: typeId
      *            required: true
      *            description: ID of the type of the tasks to retrieve.
      *            schema:
      *              type: integer
      *         responses:
      *             200:
      *                 description: tasks found by specified type.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         type: array
      *                         items:
      *                           $ref: '#/components/schemas/Task'
      *             400:
      *                 description: validation error
      *             500:
      *                 description: unknown error
      */
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

    /**
      * @swagger
      * /api/task/targetAndType/{targetId}/{typeId}:
      *     get:
      *         tags:
      *           - Task
      *         summary: returns a task by type.
      *         description: Retrieves task by type.
      *         parameters:
      *          - in: path
      *            name: targetId
      *            required: true
      *            description: ID of the target of the task to retrieve.
      *            schema:
      *              type: integer
      *          - in: path
      *            name: typeId
      *            required: true
      *            description: ID of the type of the tasks to retrieve.
      *            schema:
      *              type: integer
      *         responses:
      *             200:
      *                 description: tasks found by specified target and  type.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         type: array
      *                         items:
      *                           $ref: '#/components/schemas/Task'
      *             400:
      *                 description: validation error
      *             500:
      *                 description: unknown error
      */
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

    /**
      * @swagger
      * /api/task/description/{description}:
      *     get:
      *         tags:
      *           - Task
      *         summary: returns a task by description.
      *         description: Retrieves task by description.
      *         parameters:
      *          - in: path
      *            name: description
      *            required: true
      *            description: Description of the tasks to retrieve.
      *            schema:
      *              type: string
      *         responses:
      *             200:
      *                 description: tasks found by specified description.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         type: array
      *                         items:
      *                           $ref: '#/components/schemas/Task'
      *             400:
      *                 description: validation error
      *             500:
      *                 description: unknown error
      */
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

    /**
      * @swagger
      * /api/task/target/{targetId}:
      *     get:
      *         tags:
      *           - Task
      *         summary: returns a task by target.
      *         description: Retrieves task by target.
      *         parameters:
      *          - in: path
      *            name: targetId
      *            required: true
      *            description: ID of the target of the tasks to retrieve.
      *            schema:
      *              type: integer
      *         responses:
      *             200:
      *                 description: tasks found by specified target.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         type: array
      *                         items:
      *                           $ref: '#/components/schemas/Task'
      *             400:
      *                 description: validation error
      *             500:
      *                 description: unknown error
      */
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