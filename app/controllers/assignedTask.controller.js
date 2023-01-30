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


module.exports = class AssignedTaskController {

    /**
     * @swagger
     * tags:
     *   - name: Assigned Task
     *     description: An entity that marries a task to a date and (optionally) to a person, which can be tracked with a completion status, and can have subtasks.
     */
    constructor() {

     }

     /**
      * @swagger
      * /api/assignedTask:
      *     get:
      *         tags:
      *           - Assigned Task
      *         summary: returns a list of all assigned tasks
      *         description: Retrieves a list of all assigned tasks.
      *         responses:
      *             200:
      *                 description: a list of all assigned tasks joined with their tasks, those tasks' targets, and the assigned tasks' persons.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         type: array
      *                         items:
      *                           type: object
      *                           properties:
      *                             id:
      *                               type: integer
      *                               description: ID of the assigned task.
      *                               example: 10
      *                             personId:
      *                               type: integer
      *                               description: The ID of the person assigned to the assigned task.
      *                               example: 5
      *                             taskId:
      *                               type: integer
      *                               description: The ID of the task for the assigned task.
      *                               example: 56
      *                             type:
      *                               type: string
      *                               enum:
      *                                 - DAILY
      *                                 - WEEKLY
      *                                 - BIWEEKLY
      *                                 - MONTHLY
      *                                 - YEARLY
      *                                 - STANDALONE
      *                               description: The schedule type of the assigned task. In ['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'YEARLY', 'STANDALONE'].
      *                               example: WEEKLY
      *                             timeOfDay:
      *                               type: string
      *                               description: The start time of the assigned task.
      *                               example: 10:00
      *                             endTimeOfDay:
      *                               type: string
      *                               description: The end time of the assigned task.
      *                               example: 12:00
      *                             dueDate:
      *                               type: string
      *                               description: The due date of the assigned task.
      *                               example: 2022-11-15
      *                             occurrences:
      *                                type: integer
      *                                description: The number of occurrences of the assigned task.
      *                                example: 12
      *                             complete:
      *                               type: boolean
      *                               description: Whether the assigned task is complete.
      *                               example: true
      *                             createdAt:
      *                               type: string
      *                               description: The date the assigned task was created.
      *                               example: 2023-01-01T01:13:51.000Z
      *                             updatedAt:
      *                               type: string
      *                               description: The date the assigned task was updated.
      *                               example: 2023-01-01T01:13:51.000Z
      *                             task:
      *                               type: object
      *                               properties:
      *                                 id:
      *                                   type: integer
      *                                   description: ID of the task.
      *                                   example: 31
      *                                 description:
      *                                   type: string
      *                                   description: The task's description.
      *                                   example: task description
      *                                 typeId:
      *                                   type: integer
      *                                   description: The ID of the task type for the task.
      *                                   example: 9
      *                                 targetId:
      *                                   type: integer
      *                                   description: The ID of the target for the task.
      *                                   example: 3
      *                                 value:
      *                                   type: integer
      *                                   description: The value of the task.
      *                                   example: 150
      *                                 createdAt:
      *                                   type: string
      *                                   description: The date the task was created.
      *                                   example: 2023-01-01T01:13:51.000Z
      *                                 updatedAt:
      *                                   type: string
      *                                   description: The date the task was updated.
      *                                   example: 2023-01-01T01:13:51.000Z
      *                                 target:
      *                                   type: object
      *                                   properties:
      *                                     id:
      *                                       type: integer
      *                                       description: ID of the target.
      *                                       example: 5
      *                                     description:
      *                                       type: string
      *                                       description: The target's description.
      *                                       example: target description
      *                                     typeId:
      *                                       type: integer
      *                                       description: The ID of the target type for the target.
      *                                       example: 2
      *                                     createdAt:
      *                                       type: string
      *                                       description: The date the target was created.
      *                                       example: 2023-01-01T01:13:51.000Z
      *                                     updatedAt:
      *                                       type: string
      *                                       description: The date the target was updated.
      *                                       example: 2023-01-01T01:13:51.000Z
      *                             person:
      *                               type: object
      *                               properties:
      *                                 id:
      *                                   type: integer
      *                                   description: ID of the person.
      *                                   example: 5
      *                                 firstName:
      *                                   type: string
      *                                   description: The person's first name.
      *                                   example: Annie
      *                                 lastName:
      *                                   type: string
      *                                   description: The person's last name.
      *                                   example: Wahl
      *                                 email:
      *                                   type: string
      *                                   description: The person's email.
      *                                   example: admin@wahlhalla.com
      *                                 createdAt:
      *                                   type: date
      *                                   description: The date the person was created.
      *                                   example: 2023-01-01T01:13:51.000Z
      *                                 updatedAt:
      *                                   type: date
      *                                   description: The date the person was updated.
      *                                   example: 2023-01-01T01:13:51.000Z                        
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

     /**
      * @swagger
      * /api/assignedTask/{id}:
      *     get:
      *         tags:
      *           - Assigned Task
      *         summary: returns a single assigned task by the provided ID.
      *         description: Retrieves a single assigned task by the provided ID.
      *         parameters:
      *          - in: path
      *            name: id
      *            required: true
      *            description: Numeric ID of the assigned task to retrieve.
      *            schema:
      *              type: integer
      *         responses:
      *             200:
      *                 description: a single assigned task joined with its task, the task's target, and the assigned task's person.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         type: object
      *                         properties:
      *                           id:
      *                             type: integer
      *                             description: ID of the assigned task.
      *                             example: 10
      *                           personId:
      *                             type: integer
      *                             description: The ID of the person assigned to the assigned task.
      *                             example: 5
      *                           taskId:
      *                             type: integer
      *                             description: The ID of the task for the assigned task.
      *                             example: 56
      *                           type:
      *                             type: string
      *                             enum:
      *                               - DAILY
      *                               - WEEKLY
      *                               - BIWEEKLY
      *                               - MONTHLY
      *                               - YEARLY
      *                               - STANDALONE
      *                             description: The schedule type of the assigned task. In ['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'YEARLY', 'STANDALONE'].
      *                             example: WEEKLY
      *                           timeOfDay:
      *                             type: string
      *                             description: The start time of the assigned task.
      *                             example: 10:00
      *                           endTimeOfDay:
      *                             type: string
      *                             description: The end time of the assigned task.
      *                             example: 12:00
      *                           dueDate:
      *                             type: string
      *                             description: The due date of the assigned task.
      *                             example: 2022-11-15
      *                           occurrences:
      *                              type: integer
      *                              description: The number of occurrences of the assigned task.
      *                              example: 12
      *                           complete:
      *                             type: boolean
      *                             description: Whether the assigned task is complete.
      *                             example: true
      *                           createdAt:
      *                             type: string
      *                             description: The date the assigned task was created.
      *                             example: 2023-01-01T01:13:51.000Z
      *                           updatedAt:
      *                             type: string
      *                             description: The date the assigned task was updated.
      *                             example: 2023-01-01T01:13:51.000Z
      *                           task:
      *                             type: object
      *                             properties:
      *                               id:
      *                                 type: integer
      *                                 description: ID of the task.
      *                                 example: 31
      *                               description:
      *                                 type: string
      *                                 description: The task's description.
      *                                 example: task description
      *                               typeId:
      *                                 type: integer
      *                                 description: The ID of the task type for the task.
      *                                 example: 9
      *                               targetId:
      *                                 type: integer
      *                                 description: The ID of the target for the task.
      *                                 example: 3
      *                               value:
      *                                 type: integer
      *                                 description: The value of the task.
      *                                 example: 150
      *                               createdAt:
      *                                 type: string
      *                                 description: The date the task was created.
      *                                 example: 2023-01-01T01:13:51.000Z
      *                               updatedAt:
      *                                 type: string
      *                                 description: The date the task was updated.
      *                                 example: 2023-01-01T01:13:51.000Z
      *                               target:
      *                                 type: object
      *                                 properties:
      *                                   id:
      *                                     type: integer
      *                                     description: ID of the target.
      *                                     example: 5
      *                                   description:
      *                                     type: string
      *                                     description: The target's description.
      *                                     example: target description
      *                                   typeId:
      *                                     type: integer
      *                                     description: The ID of the target type for the target.
      *                                     example: 2
      *                                   createdAt:
      *                                     type: string
      *                                     description: The date the target was created.
      *                                     example: 2023-01-01T01:13:51.000Z
      *                                   updatedAt:
      *                                     type: string
      *                                     description: The date the target was updated.
      *                                     example: 2023-01-01T01:13:51.000Z
      *                           person:
      *                             type: object
      *                             properties:
      *                               id:
      *                                 type: integer
      *                                 description: ID of the person.
      *                                 example: 5
      *                               firstName:
      *                                 type: string
      *                                 description: The person's first name.
      *                                 example: Annie
      *                               lastName:
      *                                 type: string
      *                                 description: The person's last name.
      *                                 example: Wahl
      *                               email:
      *                                 type: string
      *                                 description: The person's email.
      *                                 example: admin@wahlhalla.com
      *                               createdAt:
      *                                 type: string
      *                                 description: The date the person was created.
      *                                 example: 2023-01-01T01:13:51.000Z
      *                               updatedAt:
      *                                 type: string
      *                                 description: The date the person was updated.
      *                                 example: 2023-01-01T01:13:51.000Z                        
      *             400:
      *                 description: validation error
      *             404:
      *                 description: cannot find assigned task with provided ID
      *             500:
      *                 description: unknown error
      */
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
   
     /**
      * @swagger
      * /api/assignedTask/{id}:
      *     put:
      *         tags:
      *           - Assigned Task
      *         summary: updates an assigned task by the provided ID.
      *         description: Updates an assigned task by the provided ID.
      *         parameters:
      *          - in: path
      *            name: id
      *            required: true
      *            description: Numeric ID of the assigned task to update.
      *            schema:
      *              type: integer
      *         requestBody:
      *            description: Updated Assigned Task
      *            required: true
      *            content:
      *              application/json:
      *                schema:
      *                  $ref: '#/components/schemas/AssignedTask'
      *         responses:
      *             200:
      *                 description: Assigned Task was updated successfully.
      *             400:
      *                 description: validation error
      *             404:
      *                 description: Cannot update Assigned Task(s) with id={id}. Maybe Assigned Task was not found or req.body is empty!
      *             500:
      *                 description: unknown error
      */
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

    /**
      * @swagger
      * /api/assignedTask/series/{id}:
      *     put:
      *         tags:
      *           - Assigned Task
      *         summary: updates all occurrences of assigned tasks in a series by the provided ID.
      *         description: Updates all occurrences of assigned tasks in a series by the provided ID.
      *         parameters:
      *          - in: path
      *            name: id
      *            required: true
      *            description: Numeric ID of the assigned task to update and find the series of.
      *            schema:
      *              type: integer
      *         requestBody:
      *            description: Updated Assigned Task
      *            required: true
      *            content:
      *              application/json:
      *                schema:
      *                  $ref: '#/components/schemas/AssignedTask'
      *         responses:
      *             200:
      *                 description: Assigned Task(s) was updated successfully.
      *             400:
      *                 description: validation error
      *             404:
      *                 description: Cannot update Assigned Task(s) with id={id}. Maybe Assigned Task was not found or req.body is empty!
      *             500:
      *                 description: unknown error
      */
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
                    if (!res.headersSent) {
                        res.send({
                            success: true,
                            message: "Assigned Task(s) was updated successfully."
                        });
                    }
                } else {
                    if (!res.headersSent) {
                        res.send({
                            message: `Cannot update Assigned Task(s) with id=${id}. Maybe Assigned Task was not found or req.body is empty!`
                        });
                    }
                }
            })
            .catch(err => {
                if (!res.headersSent) {
                    res.status(500).send({
                    message: "Error updating Assigned Task(s) with id=" + id + ". " + err
                    });
                }
            });  
        })
        .catch(err => {
            if (!res.headersSent) {
                res.status(500).send({
                message: "Error finding Assigned Task(s) with id=" + id + ". " + err
                });
            }
        });  
    };
   
     /**
      * @swagger
      * /api/assignedTask/{id}:
      *     delete:
      *         tags:
      *           - Assigned Task
      *         summary: deletes an assigned task by the provided ID.
      *         description: Deletes an assigned task by the provided ID.
      *         parameters:
      *          - in: path
      *            name: id
      *            required: true
      *            description: Numeric ID of the assigned task to delete.
      *            schema:
      *              type: integer
      *         responses:
      *             200:
      *                 description: Assigned Task was deleted successfully!
      *             400:
      *                 description: validation error
      *             404:
      *                 description: Cannot delete Assigned Task with id={id}. Maybe Assigned Task was not found!
      *             500:
      *                 description: Could not delete Assigned Task with id={id}
      */
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

     /**
      * @swagger
      * /api/assignedTask/series/{id}:
      *     delete:
      *         tags:
      *           - Assigned Task
      *         summary: deletes an assigned task and its series by the provided ID.
      *         description: Deletes an assigned task and its series by the provided ID.
      *         parameters:
      *          - in: path
      *            name: id
      *            required: true
      *            description: Numeric ID of the assigned task to delete.
      *            schema:
      *              type: integer
      *         responses:
      *             200:
      *                 description: Assigned Tasks were deleted successfully!
      *             400:
      *                 description: validation error
      *             404:
      *                 description: Cannot delete Assigned Task with id={id}. Maybe Assigned Task was not found!
      *             500:
      *                 description: Could not delete Assigned Task with id={id}
      */
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


 /**
      * @swagger
      * /api/assignedTask/:
      *     post:
      *         tags:
      *           - Assigned Task
      *         summary: creates an assigned task with the provided parameters.
      *         description: Creates an assigned task with the provided parameters
      *         requestBody:
      *            description: Assigned Task To Create
      *            required: true
      *            content:
      *              application/json:
      *                schema:
      *                  $ref: '#/components/schemas/AssignedTask'
      *         responses:
      *             200:
      *                 description: Returns the newly created assigned task.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         type: object
      *                         properties:
      *                           id:
      *                             type: integer
      *                             description: ID of the assigned task that was created.
      *                             example: 5
      *                           $ref: '#/components/schemas/AssignedTask'
      *                           createdAt:
      *                             type: date
      *                             description: The date the assigned task was created.
      *                             example: 2023-01-01T01:13:51.000Z
      *                           updatedAt:
      *                             type: date
      *                             description: The date the assigned task was updated.
      *                             example: 2023-01-01T01:13:51.000Z                   
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

      /**
      * @swagger
      * /api/assignedTask/person/{personId}:
      *     get:
      *         tags:
      *           - Assigned Task
      *         summary: returns a list of all assigned tasks assigned to provided person.
      *         description: Retrieves a list of all assigned tasks assigned to provided person.
      *         parameters:
      *          - in: path
      *            name: personId
      *            required: true
      *            description: Numeric ID of the person to find the assigned tasks of.
      *            schema:
      *              type: integer
      *         responses:
      *             200:
      *                 description: a list of all assigned tasks joined with their tasks, those tasks' targets, and the assigned tasks' persons.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         type: array
      *                         items:
      *                           type: object
      *                           properties:
      *                             id:
      *                               type: integer
      *                               description: ID of the assigned task.
      *                               example: 10
      *                             personId:
      *                               type: integer
      *                               description: The ID of the person assigned to the assigned task.
      *                               example: 5
      *                             taskId:
      *                               type: integer
      *                               description: The ID of the task for the assigned task.
      *                               example: 56
      *                             type:
      *                               type: string
      *                               enum:
      *                                 - DAILY
      *                                 - WEEKLY
      *                                 - BIWEEKLY
      *                                 - MONTHLY
      *                                 - YEARLY
      *                                 - STANDALONE
      *                               description: The schedule type of the assigned task. In ['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'YEARLY', 'STANDALONE'].
      *                               example: WEEKLY
      *                             timeOfDay:
      *                               type: string
      *                               description: The start time of the assigned task.
      *                               example: 10:00
      *                             endTimeOfDay:
      *                               type: string
      *                               description: The end time of the assigned task.
      *                               example: 12:00
      *                             dueDate:
      *                               type: string
      *                               description: The due date of the assigned task.
      *                               example: 2022-11-15
      *                             occurrences:
      *                                type: integer
      *                                description: The number of occurrences of the assigned task.
      *                                example: 12
      *                             complete:
      *                               type: boolean
      *                               description: Whether the assigned task is complete.
      *                               example: true
      *                             createdAt:
      *                               type: string
      *                               description: The date the assigned task was created.
      *                               example: 2023-01-01T01:13:51.000Z
      *                             updatedAt:
      *                               type: string
      *                               description: The date the assigned task was updated.
      *                               example: 2023-01-01T01:13:51.000Z
      *                             task:
      *                               type: object
      *                               properties:
      *                                 id:
      *                                   type: integer
      *                                   description: ID of the task.
      *                                   example: 31
      *                                 description:
      *                                   type: string
      *                                   description: The task's description.
      *                                   example: task description
      *                                 typeId:
      *                                   type: integer
      *                                   description: The ID of the task type for the task.
      *                                   example: 9
      *                                 targetId:
      *                                   type: integer
      *                                   description: The ID of the target for the task.
      *                                   example: 3
      *                                 value:
      *                                   type: integer
      *                                   description: The value of the task.
      *                                   example: 150
      *                                 createdAt:
      *                                   type: string
      *                                   description: The date the task was created.
      *                                   example: 2023-01-01T01:13:51.000Z
      *                                 updatedAt:
      *                                   type: string
      *                                   description: The date the task was updated.
      *                                   example: 2023-01-01T01:13:51.000Z
      *                                 target:
      *                                   type: object
      *                                   properties:
      *                                     id:
      *                                       type: integer
      *                                       description: ID of the target.
      *                                       example: 5
      *                                     description:
      *                                       type: string
      *                                       description: The target's description.
      *                                       example: target description
      *                                     typeId:
      *                                       type: integer
      *                                       description: The ID of the target type for the target.
      *                                       example: 2
      *                                     createdAt:
      *                                       type: string
      *                                       description: The date the target was created.
      *                                       example: 2023-01-01T01:13:51.000Z
      *                                     updatedAt:
      *                                       type: string
      *                                       description: The date the target was updated.
      *                                       example: 2023-01-01T01:13:51.000Z
      *                             person:
      *                               type: object
      *                               properties:
      *                                 id:
      *                                   type: integer
      *                                   description: ID of the person.
      *                                   example: 5
      *                                 firstName:
      *                                   type: string
      *                                   description: The person's first name.
      *                                   example: Annie
      *                                 lastName:
      *                                   type: string
      *                                   description: The person's last name.
      *                                   example: Wahl
      *                                 email:
      *                                   type: string
      *                                   description: The person's email.
      *                                   example: admin@wahlhalla.com
      *                                 createdAt:
      *                                   type: string
      *                                   description: The date the person was created.
      *                                   example: 2023-01-01T01:13:51.000Z
      *                                 updatedAt:
      *                                   type: string
      *                                   description: The date the person was updated.
      *                                   example: 2023-01-01T01:13:51.000Z                        
      *             400:
      *                 description: validation error
      *             500:
      *                 description: unknown error
      */
    findByPerson = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const person = req.params.personId;
        var condition = { personId: { [Op.eq]: person } };
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
 
      /**
      * @swagger
      * /api/assignedTask/type/{type}:
      *     get:
      *         tags:
      *           - Assigned Task
      *         summary: returns a list of all assigned tasks with the provided schedule type.
      *         description: Retrieves a list of all assigned tasks with the provided schedule type.
      *         parameters:
      *          - in: path
      *            name: type
      *            required: true
      *            description: Schedule type .
      *            schema:
      *              type: string
      *         responses:
      *             200:
      *                 description: a list of all assigned tasks joined with their tasks, those tasks' targets, and the assigned tasks' persons.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         type: array
      *                         items:
      *                           type: object
      *                           properties:
      *                             id:
      *                               type: integer
      *                               description: ID of the assigned task.
      *                               example: 10
      *                             personId:
      *                               type: integer
      *                               description: The ID of the person assigned to the assigned task.
      *                               example: 5
      *                             taskId:
      *                               type: integer
      *                               description: The ID of the task for the assigned task.
      *                               example: 56
      *                             type:
      *                               type: enum
      *                               description: The schedule type of the assigned task. In ['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'YEARLY', 'STANDALONE'].
      *                               example: WEEKLY
      *                             timeOfDay:
      *                               type: time
      *                               description: The start time of the assigned task.
      *                               example: 10:00
      *                             endTimeOfDay:
      *                               type: time
      *                               description: The end time of the assigned task.
      *                               example: 12:00
      *                             dueDate:
      *                               type: date
      *                               description: The due date of the assigned task.
      *                               example: 2022-11-15
      *                             occurrences:
      *                                type: integer
      *                                description: The number of occurrences of the assigned task.
      *                                example: 12
      *                             complete:
      *                               type: boolean
      *                               description: Whether the assigned task is complete.
      *                               example: true
      *                             createdAt:
      *                               type: date
      *                               description: The date the assigned task was created.
      *                               example: 2023-01-01T01:13:51.000Z
      *                             updatedAt:
      *                               type: date
      *                               description: The date the assigned task was updated.
      *                               example: 2023-01-01T01:13:51.000Z
      *                             task:
      *                               type: object
      *                               properties:
      *                                 id:
      *                                   type: integer
      *                                   description: ID of the task.
      *                                   example: 31
      *                                 description:
      *                                   type: string
      *                                   description: The task's description.
      *                                   example: task description
      *                                 typeId:
      *                                   type: integer
      *                                   description: The ID of the task type for the task.
      *                                   example: 9
      *                                 targetId:
      *                                   type: integer
      *                                   description: The ID of the target for the task.
      *                                   example: 3
      *                                 value:
      *                                   type: integer
      *                                   description: The value of the task.
      *                                   example: 150
      *                                 createdAt:
      *                                   type: date
      *                                   description: The date the task was created.
      *                                   example: 2023-01-01T01:13:51.000Z
      *                                 updatedAt:
      *                                   type: date
      *                                   description: The date the task was updated.
      *                                   example: 2023-01-01T01:13:51.000Z
      *                                 target:
      *                                   type: object
      *                                   properties:
      *                                     id:
      *                                       type: integer
      *                                       description: ID of the target.
      *                                       example: 5
      *                                     description:
      *                                       type: string
      *                                       description: The target's description.
      *                                       example: target description
      *                                     typeId:
      *                                       type: integer
      *                                       description: The ID of the target type for the target.
      *                                       example: 2
      *                                     createdAt:
      *                                       type: date
      *                                       description: The date the target was created.
      *                                       example: 2023-01-01T01:13:51.000Z
      *                                     updatedAt:
      *                                       type: date
      *                                       description: The date the target was updated.
      *                                       example: 2023-01-01T01:13:51.000Z
      *                             person:
      *                               type: object
      *                               properties:
      *                                 id:
      *                                   type: integer
      *                                   description: ID of the person.
      *                                   example: 5
      *                                 firstName:
      *                                   type: string
      *                                   description: The person's first name.
      *                                   example: Annie
      *                                 lastName:
      *                                   type: string
      *                                   description: The person's last name.
      *                                   example: Wahl
      *                                 email:
      *                                   type: string
      *                                   description: The person's email.
      *                                   example: admin@wahlhalla.com
      *                                 createdAt:
      *                                   type: date
      *                                   description: The date the person was created.
      *                                   example: 2023-01-01T01:13:51.000Z
      *                                 updatedAt:
      *                                   type: date
      *                                   description: The date the person was updated.
      *                                   example: 2023-01-01T01:13:51.000Z                        
      *             400:
      *                 description: validation error
      *             500:
      *                 description: unknown error
      */
    findByType = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }7

        const type = req.params.type;
        var condition = { type: { [Op.eq]: type } };
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

      /**
      * @swagger
      * /api/assignedTask/completion/{complete}:
      *     get:
      *         tags:
      *           - Assigned Task
      *         summary: returns a list of all assigned tasks that are complete or not.
      *         description: Retrieves a list of all assigned tasks that are complete or not.
      *         parameters:
      *          - in: path
      *            name: complete
      *            required: true
      *            description: Whether the assigned tasks are complete.
      *            schema:
      *              type: boolean
      *         responses:
      *             200:
      *                 description: a list of all assigned tasks joined with their tasks, those tasks' targets, and the assigned tasks' persons.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         type: array
      *                         items:
      *                           type: object
      *                           properties:
      *                             id:
      *                               type: integer
      *                               description: ID of the assigned task.
      *                               example: 10
      *                             personId:
      *                               type: integer
      *                               description: The ID of the person assigned to the assigned task.
      *                               example: 5
      *                             taskId:
      *                               type: integer
      *                               description: The ID of the task for the assigned task.
      *                               example: 56
      *                             type:
      *                               type: string
      *                               enum:
      *                                 - DAILY
      *                                 - WEEKLY
      *                                 - BIWEEKLY
      *                                 - MONTHLY
      *                                 - YEARLY
      *                                 - STANDALONE
      *                               description: The schedule type of the assigned task. In ['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'YEARLY', 'STANDALONE'].
      *                               example: WEEKLY
      *                             timeOfDay:
      *                               type: string
      *                               description: The start time of the assigned task.
      *                               example: 10:00
      *                             endTimeOfDay:
      *                               type: string
      *                               description: The end time of the assigned task.
      *                               example: 12:00
      *                             dueDate:
      *                               type: string
      *                               description: The due date of the assigned task.
      *                               example: 2022-11-15
      *                             occurrences:
      *                                type: integer
      *                                description: The number of occurrences of the assigned task.
      *                                example: 12
      *                             complete:
      *                               type: boolean
      *                               description: Whether the assigned task is complete.
      *                               example: true
      *                             createdAt:
      *                               type: string
      *                               description: The date the assigned task was created.
      *                               example: 2023-01-01T01:13:51.000Z
      *                             updatedAt:
      *                               type: string
      *                               description: The date the assigned task was updated.
      *                               example: 2023-01-01T01:13:51.000Z
      *                             task:
      *                               type: object
      *                               properties:
      *                                 id:
      *                                   type: integer
      *                                   description: ID of the task.
      *                                   example: 31
      *                                 description:
      *                                   type: string
      *                                   description: The task's description.
      *                                   example: task description
      *                                 typeId:
      *                                   type: integer
      *                                   description: The ID of the task type for the task.
      *                                   example: 9
      *                                 targetId:
      *                                   type: integer
      *                                   description: The ID of the target for the task.
      *                                   example: 3
      *                                 value:
      *                                   type: integer
      *                                   description: The value of the task.
      *                                   example: 150
      *                                 createdAt:
      *                                   type: string
      *                                   description: The date the task was created.
      *                                   example: 2023-01-01T01:13:51.000Z
      *                                 updatedAt:
      *                                   type: string
      *                                   description: The date the task was updated.
      *                                   example: 2023-01-01T01:13:51.000Z
      *                                 target:
      *                                   type: object
      *                                   properties:
      *                                     id:
      *                                       type: integer
      *                                       description: ID of the target.
      *                                       example: 5
      *                                     description:
      *                                       type: string
      *                                       description: The target's description.
      *                                       example: target description
      *                                     typeId:
      *                                       type: integer
      *                                       description: The ID of the target type for the target.
      *                                       example: 2
      *                                     createdAt:
      *                                       type: string
      *                                       description: The date the target was created.
      *                                       example: 2023-01-01T01:13:51.000Z
      *                                     updatedAt:
      *                                       type: string
      *                                       description: The date the target was updated.
      *                                       example: 2023-01-01T01:13:51.000Z
      *                             person:
      *                               type: object
      *                               properties:
      *                                 id:
      *                                   type: integer
      *                                   description: ID of the person.
      *                                   example: 5
      *                                 firstName:
      *                                   type: string
      *                                   description: The person's first name.
      *                                   example: Annie
      *                                 lastName:
      *                                   type: string
      *                                   description: The person's last name.
      *                                   example: Wahl
      *                                 email:
      *                                   type: string
      *                                   description: The person's email.
      *                                   example: admin@wahlhalla.com
      *                                 createdAt:
      *                                   type: string
      *                                   description: The date the person was created.
      *                                   example: 2023-01-01T01:13:51.000Z
      *                                 updatedAt:
      *                                   type: string
      *                                   description: The date the person was updated.
      *                                   example: 2023-01-01T01:13:51.000Z                        
      *             400:
      *                 description: validation error
      *             500:
      *                 description: unknown error
      */
    findByCompletion = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const complete = req.params.complete;
        var condition = { complete: { [Op.eq]: complete } };
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

      /**
      * @swagger
      * /api/assignedTask/dueDate/{dueDate}:
      *     get:
      *         tags:
      *           - Assigned Task
      *         summary: returns a list of all assigned tasks by due date.
      *         description: Retrieves a list of all assigned tasks by due date.
      *         parameters:
      *          - in: path
      *            name: dueDate
      *            required: true
      *            description: Due date of the assigned tasks.
      *            schema:
      *              type: date
      *         responses:
      *             200:
      *                 description: a list of all assigned tasks joined with their tasks, those tasks' targets, and the assigned tasks' persons.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         type: array
      *                         items:
      *                           type: object
      *                           properties:
      *                             id:
      *                               type: integer
      *                               description: ID of the assigned task.
      *                               example: 10
      *                             personId:
      *                               type: integer
      *                               description: The ID of the person assigned to the assigned task.
      *                               example: 5
      *                             taskId:
      *                               type: integer
      *                               description: The ID of the task for the assigned task.
      *                               example: 56
      *                             type:
      *                               type: string
      *                               enum:
      *                                 - DAILY
      *                                 - WEEKLY
      *                                 - BIWEEKLY
      *                                 - MONTHLY
      *                                 - YEARLY
      *                                 - STANDALONE
      *                               description: The schedule type of the assigned task. In ['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'YEARLY', 'STANDALONE'].
      *                               example: WEEKLY
      *                             timeOfDay:
      *                               type: string
      *                               description: The start time of the assigned task.
      *                               example: 10:00
      *                             endTimeOfDay:
      *                               type: string
      *                               description: The end time of the assigned task.
      *                               example: 12:00
      *                             dueDate:
      *                               type: string
      *                               description: The due date of the assigned task.
      *                               example: 2022-11-15
      *                             occurrences:
      *                                type: integer
      *                                description: The number of occurrences of the assigned task.
      *                                example: 12
      *                             complete:
      *                               type: boolean
      *                               description: Whether the assigned task is complete.
      *                               example: true
      *                             createdAt:
      *                               type: string
      *                               description: The date the assigned task was created.
      *                               example: 2023-01-01T01:13:51.000Z
      *                             updatedAt:
      *                               type: string
      *                               description: The date the assigned task was updated.
      *                               example: 2023-01-01T01:13:51.000Z
      *                             task:
      *                               type: object
      *                               properties:
      *                                 id:
      *                                   type: integer
      *                                   description: ID of the task.
      *                                   example: 31
      *                                 description:
      *                                   type: string
      *                                   description: The task's description.
      *                                   example: task description
      *                                 typeId:
      *                                   type: integer
      *                                   description: The ID of the task type for the task.
      *                                   example: 9
      *                                 targetId:
      *                                   type: integer
      *                                   description: The ID of the target for the task.
      *                                   example: 3
      *                                 value:
      *                                   type: integer
      *                                   description: The value of the task.
      *                                   example: 150
      *                                 createdAt:
      *                                   type: string
      *                                   description: The date the task was created.
      *                                   example: 2023-01-01T01:13:51.000Z
      *                                 updatedAt:
      *                                   type: string
      *                                   description: The date the task was updated.
      *                                   example: 2023-01-01T01:13:51.000Z
      *                                 target:
      *                                   type: object
      *                                   properties:
      *                                     id:
      *                                       type: integer
      *                                       description: ID of the target.
      *                                       example: 5
      *                                     description:
      *                                       type: string
      *                                       description: The target's description.
      *                                       example: target description
      *                                     typeId:
      *                                       type: integer
      *                                       description: The ID of the target type for the target.
      *                                       example: 2
      *                                     createdAt:
      *                                       type: string
      *                                       description: The date the target was created.
      *                                       example: 2023-01-01T01:13:51.000Z
      *                                     updatedAt:
      *                                       type: string
      *                                       description: The date the target was updated.
      *                                       example: 2023-01-01T01:13:51.000Z
      *                             person:
      *                               type: object
      *                               properties:
      *                                 id:
      *                                   type: integer
      *                                   description: ID of the person.
      *                                   example: 5
      *                                 firstName:
      *                                   type: string
      *                                   description: The person's first name.
      *                                   example: Annie
      *                                 lastName:
      *                                   type: string
      *                                   description: The person's last name.
      *                                   example: Wahl
      *                                 email:
      *                                   type: string
      *                                   description: The person's email.
      *                                   example: admin@wahlhalla.com
      *                                 createdAt:
      *                                   type: string
      *                                   description: The date the person was created.
      *                                   example: 2023-01-01T01:13:51.000Z
      *                                 updatedAt:
      *                                   type: string
      *                                   description: The date the person was updated.
      *                                   example: 2023-01-01T01:13:51.000Z                        
      *             400:
      *                 description: validation error
      *             500:
      *                 description: unknown error
      */
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


      /**
      * @swagger
      * /api/assignedTask/que/ry:
      *     get:
      *         tags:
      *           - Assigned Task
      *         summary: returns a list of all assigned tasks by query.
      *         description: Retrieves a list of all assigned tasks by query.
      *         parameters:
      *          - in: query
      *            name: dueDate
      *            required: false
      *            description: Due date of the assigned tasks.
      *            schema:
      *              type: date
      *          - in: query
      *            name: complete
      *            required: false
      *            description: Completion status of the assigned tasks.
      *            schema:
      *              type: boolean
      *          - in: query
      *            name: type
      *            required: false
      *            description: Schedule type of the assigned tasks.
      *            schema:
      *              type: enum
      *          - in: query
      *            name: personId
      *            required: false
      *            description: Person assigned to the assigned tasks.
      *            schema:
      *              type: integer
      *         responses:
      *             200:
      *                 description: a list of all assigned tasks joined with their tasks, those tasks' targets, and the assigned tasks' persons.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         type: array
      *                         items:
      *                           type: object
      *                           properties:
      *                             id:
      *                               type: integer
      *                               description: ID of the assigned task.
      *                               example: 10
      *                             personId:
      *                               type: integer
      *                               description: The ID of the person assigned to the assigned task.
      *                               example: 5
      *                             taskId:
      *                               type: integer
      *                               description: The ID of the task for the assigned task.
      *                               example: 56
      *                             type:
      *                               type: string
      *                               enum:
      *                                 - DAILY
      *                                 - WEEKLY
      *                                 - BIWEEKLY
      *                                 - MONTHLY
      *                                 - YEARLY
      *                                 - STANDALONE
      *                               description: The schedule type of the assigned task. In ['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'YEARLY', 'STANDALONE'].
      *                               example: WEEKLY
      *                             timeOfDay:
      *                               type: string
      *                               description: The start time of the assigned task.
      *                               example: 10:00
      *                             endTimeOfDay:
      *                               type: string
      *                               description: The end time of the assigned task.
      *                               example: 12:00
      *                             dueDate:
      *                               type: string
      *                               description: The due date of the assigned task.
      *                               example: 2022-11-15
      *                             occurrences:
      *                                type: integer
      *                                description: The number of occurrences of the assigned task.
      *                                example: 12
      *                             complete:
      *                               type: boolean
      *                               description: Whether the assigned task is complete.
      *                               example: true
      *                             createdAt:
      *                               type: string
      *                               description: The date the assigned task was created.
      *                               example: 2023-01-01T01:13:51.000Z
      *                             updatedAt:
      *                               type: string
      *                               description: The date the assigned task was updated.
      *                               example: 2023-01-01T01:13:51.000Z
      *                             task:
      *                               type: object
      *                               properties:
      *                                 id:
      *                                   type: integer
      *                                   description: ID of the task.
      *                                   example: 31
      *                                 description:
      *                                   type: string
      *                                   description: The task's description.
      *                                   example: task description
      *                                 typeId:
      *                                   type: integer
      *                                   description: The ID of the task type for the task.
      *                                   example: 9
      *                                 targetId:
      *                                   type: integer
      *                                   description: The ID of the target for the task.
      *                                   example: 3
      *                                 value:
      *                                   type: integer
      *                                   description: The value of the task.
      *                                   example: 150
      *                                 createdAt:
      *                                   type: string
      *                                   description: The date the task was created.
      *                                   example: 2023-01-01T01:13:51.000Z
      *                                 updatedAt:
      *                                   type: string
      *                                   description: The date the task was updated.
      *                                   example: 2023-01-01T01:13:51.000Z
      *                                 target:
      *                                   type: object
      *                                   properties:
      *                                     id:
      *                                       type: integer
      *                                       description: ID of the target.
      *                                       example: 5
      *                                     description:
      *                                       type: string
      *                                       description: The target's description.
      *                                       example: target description
      *                                     typeId:
      *                                       type: integer
      *                                       description: The ID of the target type for the target.
      *                                       example: 2
      *                                     createdAt:
      *                                       type: string
      *                                       description: The date the target was created.
      *                                       example: 2023-01-01T01:13:51.000Z
      *                                     updatedAt:
      *                                       type: string
      *                                       description: The date the target was updated.
      *                                       example: 2023-01-01T01:13:51.000Z
      *                             person:
      *                               type: object
      *                               properties:
      *                                 id:
      *                                   type: integer
      *                                   description: ID of the person.
      *                                   example: 5
      *                                 firstName:
      *                                   type: string
      *                                   description: The person's first name.
      *                                   example: Annie
      *                                 lastName:
      *                                   type: string
      *                                   description: The person's last name.
      *                                   example: Wahl
      *                                 email:
      *                                   type: string
      *                                   description: The person's email.
      *                                   example: admin@wahlhalla.com
      *                                 createdAt:
      *                                   type: string
      *                                   description: The date the person was created.
      *                                   example: 2023-01-01T01:13:51.000Z
      *                                 updatedAt:
      *                                   type: string
      *                                   description: The date the person was updated.
      *                                   example: 2023-01-01T01:13:51.000Z                        
      *             400:
      *                 description: validation error
      *             500:
      *                 description: unknown error
      */    
    findByQuery = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const dueDate = url.parse(req.url, true).query.dueDate;
        const complete = url.parse(req.url, true).query.complete;
        const type = url.parse(req.url, true).query.type;
        const person = url.parse(req.url, true).query.personId;
        
        var condition = {
            [Op.and]: [
                dueDate ? { dueDate: dueDate } : null,
                complete ? { complete: complete } : null,
                type ? { type: type } : null,
                person ? { personId: person } : null,
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

      /**
      * @swagger
      * /api/assignedTask/category/{category}:
      *     get:
      *         tags:
      *           - Assigned Task
      *         summary: returns a list of all assigned tasks by specified category.
      *         description: Retrieves a list of all assigned tasks by specified category.
      *         parameters:
      *          - in: path
      *            name: category
      *            required: true
      *            description: Category of the assigned tasks' tasks' task type.
      *            schema:
      *              type: string
      *              enum:
      *                - APPOINTMENT
      *                - BILL
      *                - CHORE
      *                - LIST
      *                - OTHER
      *         responses:
      *             200:
      *                 description: a list of all assigned tasks joined with their tasks, those tasks' targets, and the assigned tasks' persons.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         type: array
      *                         items:
      *                           type: object
      *                           properties:
      *                             id:
      *                               type: integer
      *                               description: ID of the assigned task.
      *                               example: 10
      *                             personId:
      *                               type: integer
      *                               description: The ID of the person assigned to the assigned task.
      *                               example: 5
      *                             taskId:
      *                               type: integer
      *                               description: The ID of the task for the assigned task.
      *                               example: 56
      *                             type:
      *                               type: string
      *                               enum:
      *                                 - DAILY
      *                                 - WEEKLY
      *                                 - BIWEEKLY
      *                                 - MONTHLY
      *                                 - YEARLY
      *                                 - STANDALONE
      *                               description: The schedule type of the assigned task. In ['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'YEARLY', 'STANDALONE'].
      *                               example: WEEKLY
      *                             timeOfDay:
      *                               type: string
      *                               description: The start time of the assigned task.
      *                               example: 10:00
      *                             endTimeOfDay:
      *                               type: string
      *                               description: The end time of the assigned task.
      *                               example: 12:00
      *                             dueDate:
      *                               type: string
      *                               description: The due date of the assigned task.
      *                               example: 2022-11-15
      *                             occurrences:
      *                                type: integer
      *                                description: The number of occurrences of the assigned task.
      *                                example: 12
      *                             complete:
      *                               type: boolean
      *                               description: Whether the assigned task is complete.
      *                               example: true
      *                             createdAt:
      *                               type: string
      *                               description: The date the assigned task was created.
      *                               example: 2023-01-01T01:13:51.000Z
      *                             updatedAt:
      *                               type: string
      *                               description: The date the assigned task was updated.
      *                               example: 2023-01-01T01:13:51.000Z
      *                             task:
      *                               type: object
      *                               properties:
      *                                 id:
      *                                   type: integer
      *                                   description: ID of the task.
      *                                   example: 31
      *                                 description:
      *                                   type: string
      *                                   description: The task's description.
      *                                   example: task description
      *                                 typeId:
      *                                   type: integer
      *                                   description: The ID of the task type for the task.
      *                                   example: 9
      *                                 targetId:
      *                                   type: integer
      *                                   description: The ID of the target for the task.
      *                                   example: 3
      *                                 value:
      *                                   type: integer
      *                                   description: The value of the task.
      *                                   example: 150
      *                                 createdAt:
      *                                   type: string
      *                                   description: The date the task was created.
      *                                   example: 2023-01-01T01:13:51.000Z
      *                                 updatedAt:
      *                                   type: string
      *                                   description: The date the task was updated.
      *                                   example: 2023-01-01T01:13:51.000Z
      *                                 target:
      *                                   type: object
      *                                   properties:
      *                                     id:
      *                                       type: integer
      *                                       description: ID of the target.
      *                                       example: 5
      *                                     description:
      *                                       type: string
      *                                       description: The target's description.
      *                                       example: target description
      *                                     typeId:
      *                                       type: integer
      *                                       description: The ID of the target type for the target.
      *                                       example: 2
      *                                     createdAt:
      *                                       type: string
      *                                       description: The date the target was created.
      *                                       example: 2023-01-01T01:13:51.000Z
      *                                     updatedAt:
      *                                       type: string
      *                                       description: The date the target was updated.
      *                                       example: 2023-01-01T01:13:51.000Z
      *                             person:
      *                               type: object
      *                               properties:
      *                                 id:
      *                                   type: integer
      *                                   description: ID of the person.
      *                                   example: 5
      *                                 firstName:
      *                                   type: string
      *                                   description: The person's first name.
      *                                   example: Annie
      *                                 lastName:
      *                                   type: string
      *                                   description: The person's last name.
      *                                   example: Wahl
      *                                 email:
      *                                   type: string
      *                                   description: The person's email.
      *                                   example: admin@wahlhalla.com
      *                                 createdAt:
      *                                   type: string
      *                                   description: The date the person was created.
      *                                   example: 2023-01-01T01:13:51.000Z
      *                                 updatedAt:
      *                                   type: string
      *                                   description: The date the person was updated.
      *                                   example: 2023-01-01T01:13:51.000Z                        
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