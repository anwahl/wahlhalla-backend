
const { validationResult } = require('express-validator');
const db = require("../models");
const Task = db.tasks;
const AssignedTask = db.assignedTasks;
const Subtask = db.subtasks;
const Op = db.Sequelize.Op;

module.exports = class SubtaskController {
    
    /**
     * @swagger
     * tags:
     *   - name: Subtask
     *     description: An entity that can belong to an Assigned Task in a many-to-one relationship.
     */
    constructor() {
     }

     /**
      * @swagger
      * /api/subtask:
      *     get:
      *         tags:
      *           - Subtask
      *         summary: returns a list of all subtasks
      *         description: Retrieves a list of all subtasks.
      *         responses:
      *             200:
      *                 description: a list of all subtasks ordered by last name.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         type: array
      *                         items:
      *                           $ref: '#/components/schemas/Subtask'
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
        
        Subtask.findAll({include: [{
                            model: AssignedTask,
                            required: true, include: [{
                                model: Task,
                                required: true
                                }]}], order: [ [ 'createdAt', 'ASC' ]]})
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
    
    /**
      * @swagger
      * /api/subtask/{id}:
      *     get:
      *         tags:
      *           - Subtask
      *         summary: returns a subtask by ID.
      *         description: Retrieves subtask by ID.
      *         parameters:
      *          - in: path
      *            name: id
      *            required: true
      *            description: Numeric ID of the subtask to retrieve.
      *            schema:
      *              type: integer
      *         responses:
      *             200:
      *                 description: a subtask found by specified ID.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         $ref: '#/components/schemas/Subtask'
      *             400:
      *                 description: validation error
      *             404:
      *                 description: Cannot find subtask with id={id}.
      *             500:
      *                 description: unknown error
      */
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
    
    /**
      * @swagger
      * /api/subtask/{id}:
      *     put:
      *         tags:
      *           - Subtask
      *         summary: updates a subtask by ID.
      *         description: Updates subtask by ID.
      *         parameters:
      *          - in: path
      *            name: id
      *            required: true
      *            description: Numeric ID of the subtask to update.
      *            schema:
      *              type: integer
      *         requestBody:
      *           description: Updated Subtask
      *           content:
      *             application/json:
      *               schema:
      *                 $ref: '#/components/schemas/Subtask'
      *         responses:
      *             200:
      *                 description: Subtask was updated successfully.
      *             400:
      *                 description: validation error
      *             404:
      *                 description: Cannot find subtask with id={id}.
      *             500:
      *                 description: unknown error
      */
    update = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id;
        const subtask = {
            description: req.body.description,
            assignedTaskId: req.body.assignedTaskId
        };
        Subtask.count({
            where: {description: subtask.description, assignedTaskId: subtask.assignedTaskId, id: {[Op.ne]: id}}
        })
        .then(num => {
            if (num> 0) {
                res.send({message: 'Subtask already exists.'});
            } else {
                Subtask.update(req.body, { where: { id: id } })
                .then(num => {
                    if (num == 1) {
                    res.send({
                        success: true,
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
            }
        })
        .catch(err => {
            res.send({message: "Some error occurred while retrieving subtask. " + err });
        });
    };
    
     /**
      * @swagger
      * /api/subtask/{id}:
      *     delete:
      *         tags:
      *           - Subtask
      *         summary: deletes an subtask by the provided ID.
      *         description: Deletes an subtask by the provided ID.
      *         parameters:
      *          - in: path
      *            name: id
      *            required: true
      *            description: Numeric ID of the subtask to delete.
      *            schema:
      *              type: integer
      *         responses:
      *             200:
      *                 description: Subtask was deleted successfully!
      *             400:
      *                 description: validation error
      *             404:
      *                 description: Cannot delete Subtask with id={id}. Maybe Subtask was not found!
      *             500:
      *                 description: Could not delete subtask with id={id}
      */
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
                success: true,
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

    /**
      * @swagger
      * /api/subtask/:
      *     post:
      *         tags:
      *           - Subtask
      *         summary: creates an subtask with the provided parameters.
      *         description: Creates an subtask with the provided parameters
      *         requestBody:
      *            description: Subtask To Create
      *            required: true
      *            content:
      *              application/json:
      *                schema:
      *                  $ref: '#/components/schemas/Subtask'
      *         responses:
      *             200:
      *                 description: Returns the newly created subtask.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         $ref: '#/components/schemas/Subtask'              
      *             400:
      *                 description: validation error
      *             500:
      *                 description: unknown error
      */
    create = (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const subtask = {
            description: req.body.description,
            assignedTaskId: req.body.assignedTaskId
        };
        Subtask.count({
            where: {description: subtask.description, assignedTaskId: subtask.assignedTaskId}
        })
        .then(num => {
            if (num> 0) {
                res.send({message: 'Subtask already exists.'});
            } else {
                Subtask.create(subtask)
                .then(data => {
                    res.send(data);
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating the Subtask."
                    });
                });
            }
        })
        .catch(err => {
            res.send({message: "Some error occurred while retrieving subtask. " + err });
        });
       
    };

    /**
      * @swagger
      * /api/subtask/assignedTask/{assignedTaskId}:
      *     get:
      *         tags:
      *           - Subtask
      *         summary: returns subtasks by assigned task.
      *         description: Retrieves subtasks by assigned task.
      *         parameters:
      *          - in: path
      *            name: assignedTaskId
      *            required: true
      *            description: ID of the assigned task of the subtasks to retrieve.
      *            schema:
      *              type: integer
      *         responses:
      *             200:
      *                 description: subtasks found by specified assigned task.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         type: array
      *                         items:
      *                           $ref: '#/components/schemas/Subtask'
      *             400:
      *                 description: validation error
      *             500:
      *                 description: unknown error
      */
    findByAssignedTask= (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const assignedTaskId = req.params.assignedTaskId;
        var condition = assignedTaskId ? { assignedTaskId: assignedTaskId } : null;
        Subtask.findAll({ where: condition, include: [{
                            model: AssignedTask,
                            required: true, include: [{
                                model: Task,
                                required: true
                                }]}], order: [ [ 'createdAt', 'ASC' ]]})
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
    
    /**
      * @swagger
      * /api/subtask/description/{description}:
      *     get:
      *         tags:
      *           - Subtask
      *         summary: returns subtasks by name.
      *         description: Retrieves subtasks by name.
      *         parameters:
      *          - in: path
      *            name: description
      *            required: true
      *            description: Description of the subtasks to retrieve.
      *            schema:
      *              type: string
      *         responses:
      *             200:
      *                 description: subtasks found by specified description.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         type: array
      *                         items:
      *                           $ref: '#/components/schemas/Subtask'
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
        Subtask.findAll({ where: condition, include: [{
                            model: AssignedTask,
                            required: true, include: [{
                                model: Task,
                                required: true
                                }]}], order: [ [ 'createdAt', 'ASC' ]]})
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
    

    /**
      * @swagger
      * /api/subtask/assignedTask/{assignedTaskId}/description/{description}:
      *     get:
      *         tags:
      *           - Subtask
      *         summary: returns subtasks by assigned task and description.
      *         description: Retrieves subtasks by assigned task and description.
      *         parameters:
      *          - in: path
      *            name: assignedTaskId
      *            required: true
      *            description: ID of the assigned task of the subtasks to retrieve.
      *            schema:
      *              type: integer
      *          - in: path
      *            name: description
      *            required: true
      *            description: Description of the subtasks to retrieve.
      *            schema:
      *              type: string
      *         responses:
      *             200:
      *                 description: subtasks found by specified assigned task and description.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         type: array
      *                         items:
      *                           $ref: '#/components/schemas/Subtask'
      *             400:
      *                 description: validation error
      *             500:
      *                 description: unknown error
      */
    findByTaskAndDescription = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const description = req.params.description;
        const assignedTaskId = req.params.assignedTaskId;
        var condition = {[Op.and]: [ {description: { [Op.like]: `%${description}%` } } , {assignedTaskId: assignedTaskId}]};
        Subtask.findAll({ where: condition, include: [{
                            model: AssignedTask,
                            required: true, include: [{
                                model: Task,
                                required: true
                                }]}], order: [ [ 'createdAt', 'ASC' ]]})
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