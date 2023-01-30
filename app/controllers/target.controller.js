
const { validationResult } = require('express-validator');
const db = require("../models");
const Target = db.targets;
const TargetType = db.targetTypes;
const Op = db.Sequelize.Op;

module.exports = class TargetController {

    /**
     * @swagger
     * tags:
     *   - name: Target
     *     description: An entity representing an object or place to be the target of tasks.
     */
    constructor() {
     }

      /**
      * @swagger
      * /api/target:
      *     get:
      *         tags:
      *           - Target
      *         summary: returns a list of all targets
      *         description: Retrieves a list of all targets.
      *         responses:
      *             200:
      *                 description: a list of all targets ordered by description.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         type: array
      *                         items:
      *                           $ref: '#/components/schemas/Target'
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
        
        Target.findAll({ include: {
                    model: TargetType,
                    required: true, 
                },
                order: [ [ 'description', 'ASC' ]]})
            .then(data => {
                res.send(data);
            })
            .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving target."
            });
        });
    };
        
    /**
      * @swagger
      * /api/target/{id}:
      *     get:
      *         tags:
      *           - Target
      *         summary: returns a target by ID.
      *         description: Retrieves target by ID.
      *         parameters:
      *          - in: path
      *            name: id
      *            required: true
      *            description: Numeric ID of the target to retrieve.
      *            schema:
      *              type: integer
      *         responses:
      *             200:
      *                 description: a target found by specified ID.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         $ref: '#/components/schemas/Target'
      *             400:
      *                 description: validation error
      *             404:
      *                 description: Cannot find target with id={id}.
      *             500:
      *                 description: unknown error
      */
    findOne = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id;
        Target.findByPk(id, {include: {
                            model: TargetType,
                            required: true
                                }})
        .then(data => {
            if (data) {
            res.send(data);
            } else {
            res.status(404).send({
                message: `Cannot find target with id=${id}.`
            });
            }
        })
        .catch(err => {
            res.status(500).send({
            message: "Error retrieving target with id=" + id
            });
        });
    };
    
    /**
      * @swagger
      * /api/target/{id}:
      *     put:
      *         tags:
      *           - Target
      *         summary: updates a target by ID.
      *         description: Updates target by ID.
      *         parameters:
      *          - in: path
      *            name: id
      *            required: true
      *            description: Numeric ID of the target to update.
      *            schema:
      *              type: integer
      *         requestBody:
      *           description: Updated Target
      *           content:
      *             application/json:
      *               schema:
      *                 $ref: '#/components/schemas/Target'
      *         responses:
      *             200:
      *                 description: Target was updated successfully.
      *             400:
      *                 description: validation error
      *             404:
      *                 description: Cannot find target with id={id}.
      *             500:
      *                 description: unknown error
      */
    update = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id;
        const target = req.body;
        Target.count({
            where: {description: target.description, typeId: target.typeId, id: {[Op.ne]: id}}
        })
        .then(num => {
            if (num> 0) {
                res.send({message: 'Target already exists.'});
            } else {
                Target.update(target, {
                where: { id: id }
                })
                .then(num => {
                    if (num == 1) {
                        res.send({
                            success: true,
                            message: "Target was updated successfully."
                        });
                    } else {
                        res.send({
                            message: `Cannot update target with id=${id}. Maybe target was not found or req.body is empty!`
                        });
                    }
                })
                .catch(err => {
                    res.status(500).send({
                    message: "Error updating target with id=" + id
                    });
                });
            }
        })
        .catch(err => {
            res.send({message: "Some error occurred while retrieving Target. " + err });
        });
    };
     
    /**
      * @swagger
      * /api/target/{id}:
      *     delete:
      *         tags:
      *           - Target
      *         summary: deletes an target by the provided ID.
      *         description: Deletes an target by the provided ID.
      *         parameters:
      *          - in: path
      *            name: id
      *            required: true
      *            description: Numeric ID of the target to delete.
      *            schema:
      *              type: integer
      *         responses:
      *             200:
      *                 description: Target was deleted successfully!
      *             400:
      *                 description: validation error
      *             404:
      *                 description: Cannot delete Target with id={id}. Maybe Target was not found!
      *             500:
      *                 description: Could not delete target with id={id}
      */
    delete = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const id = req.params.id;
        Target.destroy({
        where: { id: id }
        })
        .then(num => {
            if (num == 1) {
            res.send({
                success: true,
                message: "Target was deleted successfully!"
            });
            } else {
            res.send({
                message: `Cannot delete target with id=${id}. Maybe target was not found!`
            });
            }
        })
        .catch(err => {
            res.status(500).send({
            message: "Could not delete target with id=" + id
            });
        });
    };

    /**
      * @swagger
      * /api/target/:
      *     post:
      *         tags:
      *           - Target
      *         summary: creates an target with the provided parameters.
      *         description: Creates an target with the provided parameters
      *         requestBody:
      *            description: Target To Create
      *            required: true
      *            content:
      *              application/json:
      *                schema:
      *                  $ref: '#/components/schemas/Target'
      *         responses:
      *             200:
      *                 description: Returns the newly created target.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         $ref: '#/components/schemas/Target'              
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

        const target = {
            description: req.body.description,
            typeId: req.body.typeId
        };
        Target.count({
            where: {description: target.description, typeId: target.typeId}
        })
        .then(num => {
            if (num> 0) {
                res.send({message: 'Target already exists.'});
            } else {
                Target.create(target)
                .then(data => {
                res.send(data);
                })
                .catch(err => {
                res.status(500).send({
                        message:
                        err.message || "Some error occurred while creating the Target."
                    });
                });
            }
        })
        .catch(err => {
            res.send({message: "Some error occurred while retrieving Target. " + err });
        });
    };

    /**
      * @swagger
      * /api/target/type/{typeId}:
      *     get:
      *         tags:
      *           - Target
      *         summary: returns a target by name.
      *         description: Retrieves target by name.
      *         parameters:
      *          - in: path
      *            name: typeId
      *            required: true
      *            description: ID of the target type of the targets to retrieve.
      *            schema:
      *              type: integer
      *         responses:
      *             200:
      *                 description: a target found by specified target type.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         type: array
      *                         items:
      *                           $ref: '#/components/schemas/Target'
      *             400:
      *                 description: validation error
      *             500:
      *                 description: unknown errors
      */
    findByType= (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const typeId = req.params.typeId;
        var condition = typeId ? { typeId: typeId } : null;
        Target.findAll({ where: condition,
            order: [ [ 'description', 'ASC' ]] })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Target."
            });
        });
    };

    /**
      * @swagger
      * /api/target/description/{description}:
      *     get:
      *         tags:
      *           - Target
      *         summary: returns a target by name.
      *         description: Retrieves target by name.
      *         parameters:
      *          - in: path
      *            name: description
      *            required: true
      *            description: Description of the targets to retrieve.
      *            schema:
      *              type: string
      *         responses:
      *             200:
      *                 description: a target found by specified target type.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         type: array
      *                         items:
      *                           $ref: '#/components/schemas/Target'
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
        Target.findAll({ where: condition,
            order: [ [ 'description', 'ASC' ]] })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Target."
            });
        });
    };
}