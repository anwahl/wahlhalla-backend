
const { validationResult } = require('express-validator');
const db = require("../models");
const TaskType = db.taskTypes;
const Op = db.Sequelize.Op;

module.exports = class TaskTypeController {
    
    /**
     * @swagger
     * tags:
     *   - name: Task Type
     *     description: An entity that is designed to describe a task.
     */
    constructor() {
     }

     /**
      * @swagger
      * /api/taskType:
      *     get:
      *         tags:
      *           - Task Type
      *         summary: returns a list of all task types
      *         description: Retrieves a list of all task types.
      *         responses:
      *             200:
      *                 description: a list of all task types ordered by description.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         type: array
      *                         items:
      *                           $ref: '#/components/schemas/TaskType'
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
    
    /**
      * @swagger
      * /api/taskType/{id}:
      *     get:
      *         tags:
      *           - Task Type
      *         summary: returns a task type by ID.
      *         description: Retrieves task type by ID.
      *         parameters:
      *          - in: path
      *            name: id
      *            required: true
      *            description: Numeric ID of the task type to retrieve.
      *            schema:
      *              type: integer
      *         responses:
      *             200:
      *                 description: a task type found by specified ID.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         $ref: '#/components/schemas/TaskType'
      *             400:
      *                 description: validation error
      *             404:
      *                 description: Cannot find taskType with id={id}.
      *             500:
      *                 description: unknown error
      */
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
    
     /**
      * @swagger
      * /api/taskType/{id}:
      *     put:
      *         tags:
      *           - Task Type
      *         summary: updates a task type by ID.
      *         description: Updates task type by ID.
      *         parameters:
      *          - in: path
      *            name: id
      *            required: true
      *            description: Numeric ID of the task type to update.
      *            schema:
      *              type: integer
      *         requestBody:
      *           description: Updated task type
      *           content:
      *             application/json:
      *               schema:
      *                 $ref: '#/components/schemas/TaskType'
      *         responses:
      *             200:
      *                 description: TaskType was updated successfully.
      *             400:
      *                 description: validation error
      *             404:
      *                 description: Cannot find taskType with id={id}.
      *             500:
      *                 description: unknown error
      */
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
      
     /**
      * @swagger
      * /api/taskType/{id}:
      *     delete:
      *         tags:
      *           - Task Type
      *         summary: deletes an task type by the provided ID.
      *         description: Deletes an task type by the provided ID.
      *         parameters:
      *          - in: path
      *            name: id
      *            required: true
      *            description: Numeric ID of the task type to delete.
      *            schema:
      *              type: integer
      *         responses:
      *             200:
      *                 description: TaskType was deleted successfully!
      *             400:
      *                 description: validation error
      *             404:
      *                 description: Cannot delete TaskType with id={id}. Maybe TaskType was not found!
      *             500:
      *                 description: Could not delete taskType with id={id}
      */
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

    /**
      * @swagger
      * /api/taskType/:
      *     post:
      *         tags:
      *           - Task Type
      *         summary: creates an task type with the provided parameters.
      *         description: Creates an task type with the provided parameters
      *         requestBody:
      *            description: TaskType To Create
      *            required: true
      *            content:
      *              application/json:
      *                schema:
      *                  $ref: '#/components/schemas/TaskType'
      *         responses:
      *             200:
      *                 description: Returns the newly created task type.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         $ref: '#/components/schemas/TaskType'              
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

    /**
      * @swagger
      * /api/taskType/category/{category}:
      *     get:
      *         tags:
      *           - Task Type
      *         summary: returns a taskType by category.
      *         description: Retrieves taskType by category.
      *         parameters:
      *          - in: path
      *            name: category
      *            required: true
      *            description: Category of the task type to retrieve.
      *            schema:
      *              type: string
      *         responses:
      *             200:
      *                 description: task types found by specified category.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         type: array
      *                         items:
      *                           $ref: '#/components/schemas/TaskType'
      *             400:
      *                 description: validation error
      *             500:
      *                 description: unknown error
      */
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
    
    /**
      * @swagger
      * /api/taskType/description/{description}:
      *     get:
      *         tags:
      *           - Task Type
      *         summary: returns a taskType by description.
      *         description: Retrieves taskType by description.
      *         parameters:
      *          - in: path
      *            name: description
      *            required: true
      *            description: description of the task type to retrieve.
      *            schema:
      *              type: string
      *         responses:
      *             200:
      *                 description: task types found by specified description.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         type: array
      *                         items:
      *                           $ref: '#/components/schemas/TaskType'
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