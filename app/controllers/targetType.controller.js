
const { validationResult } = require('express-validator');
const db = require("../models");
const TargetType = db.targetTypes;
const Op = db.Sequelize.Op;

module.exports = class TargetTypeController  {

    /**
     * @swagger
     * tags:
     *   - name: Target Type
     *     description: An entity that is designed to describe a target.
     */
    constructor() {
        
     }

     /**
      * @swagger
      * /api/targetType:
      *     get:
      *         tags:
      *           - Target Type
      *         summary: returns a list of all target types
      *         description: Retrieves a list of all target types.
      *         responses:
      *             200:
      *                 description: a list of all target types ordered by last name.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         type: array
      *                         items:
      *                           $ref: '#/components/schemas/TargetType'
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
        
        TargetType.findAll({
            order: [ [ 'description', 'ASC' ]]})
            .then(data => {
                res.send(data);
            })
            .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving Target Type."
            });
        });
    };
       
    /**
      * @swagger
      * /api/targetType/{id}:
      *     get:
      *         tags:
      *           - Target Type
      *         summary: returns a target type by ID.
      *         description: Retrieves target type by ID.
      *         parameters:
      *          - in: path
      *            name: id
      *            required: true
      *            description: Numeric ID of the target type to retrieve.
      *            schema:
      *              type: integer
      *         responses:
      *             200:
      *                 description: a target type found by specified ID.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         $ref: '#/components/schemas/TargetType'
      *             400:
      *                 description: validation error
      *             404:
      *                 description: Cannot find targetType with id={id}.
      *             500:
      *                 description: unknown error
      */
    findOne = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id;
        TargetType.findByPk(id)
        .then(data => {
            if (data) {
            res.send(data);
            } else {
            res.status(404).send({
                message: `Cannot find Target Type with id=${id}.`
            });
            }
        })
        .catch(err => {
            res.status(500).send({
            message: "Error retrieving Target Type with id=" + id
            });
        });
    };
    
    /**
      * @swagger
      * /api/targetType/{id}:
      *     put:
      *         tags:
      *           - Target Type
      *         summary: updates a target type by ID.
      *         description: Updates target type by ID.
      *         parameters:
      *          - in: path
      *            name: id
      *            required: true
      *            description: Numeric ID of the target type to update.
      *            schema:
      *              type: integer
      *         requestBody:
      *           description: Updated TargetType
      *           content:
      *             application/json:
      *               schema:
      *                 $ref: '#/components/schemas/TargetType'
      *         responses:
      *             200:
      *                 description: TargetType was updated successfully.
      *             400:
      *                 description: validation error
      *             404:
      *                 description: Cannot find target type with id={id}.
      *             500:
      *                 description: unknown error
      */
    update = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id;
        const targetType = {
            description: req.body.description
        };
        TargetType.count({
            where: {description: targetType.description, id: {[Op.ne]: id}}
        })
        .then(num => {
            if (num> 0) {
                res.send({message: 'Target Type already exists.'});
            } else {
                TargetType.update(req.body, {
                where: { id: id }
                })
                .then(num => {
                    if (num == 1) {
                        res.send({
                            success: true,
                            message: "Target Type was updated successfully."
                        });
                    } else {
                        res.send({
                            message: `Cannot update Target Type with id=${id}. Maybe Target Type was not found or req.body is empty!`
                        });
                    }
                })
                .catch(err => {
                    res.status(500).send({
                    message: "Error updating Target Type with id=" + id
                    });
                });
            }
        })
        .catch(err => {
            res.send({message: "Some error occurred while retrieving Target Type. " + err });
        });
    };
    
    /**
      * @swagger
      * /api/targetType/{id}:
      *     delete:
      *         tags:
      *           - Target Type
      *         summary: deletes an target type by the provided ID.
      *         description: Deletes an target type by the provided ID.
      *         parameters:
      *          - in: path
      *            name: id
      *            required: true
      *            description: Numeric ID of the target type to delete.
      *            schema:
      *              type: integer
      *         responses:
      *             200:
      *                 description: TargetType was deleted successfully!
      *             400:
      *                 description: validation error
      *             404:
      *                 description: Cannot delete Target Type with id={id}. Maybe TargetType was not found!
      *             500:
      *                 description: Could not delete target type with id={id}
      */
    delete = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const id = req.params.id;
        TargetType.destroy({
        where: { id: id }
        })
        .then(num => {
            if (num == 1) {
            res.send({
                success: true,
                message: "Target Type was deleted successfully!"
            });
            } else {
            res.send({
                message: `Cannot delete Target Type with id=${id}. Maybe Target Type was not found!`
            });
            }
        })
        .catch(err => {
            res.status(500).send({
            message: "Could not delete Target Type with id=" + id
            });
        });
    };

    /**
      * @swagger
      * /api/targetType/:
      *     post:
      *         tags:
      *           - Target Type
      *         summary: creates an target type with the provided parameters.
      *         description: Creates an target type with the provided parameters
      *         requestBody:
      *            description: Target Type To Create
      *            required: true
      *            content:
      *              application/json:
      *                schema:
      *                  $ref: '#/components/schemas/TargetType'
      *         responses:
      *             200:
      *                 description: Returns the newly created target type.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         $ref: '#/components/schemas/TargetType'              
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

        const targetType = {
            description: req.body.description
        };
        TargetType.count({
            where: {description: targetType.description}
        })
        .then(num => {
            if (num> 0) {
                res.send({message: 'Target Type already exists.'});
            } else {
                TargetType.create(targetType)
                .then(data => {
                res.send(data);
                })
                .catch(err => {
                res.status(500).send({
                        message:
                        err.message || "Some error occurred while creating the Target Type."
                    });
                });
            }
        })
        .catch(err => {
            res.send({message: "Some error occurred while retrieving Target Type. " + err });
        });
    };

    /**
      * @swagger
      * /api/targetType/description/{description}:
      *     get:
      *         tags:
      *           - Target Type
      *         summary: returns a target type by description.
      *         description: Retrieves target type by description.
      *         parameters:
      *          - in: path
      *            name: description
      *            required: true
      *            description: Description of the target type to retrieve.
      *            schema:
      *              type: string
      *         responses:
      *             200:
      *                 description: target types found by specified description.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         type: array
      *                         items:
      *                           $ref: '#/components/schemas/TargetType'
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
        TargetType.findAll({ where: condition,
            order: [ [ 'description', 'ASC' ]] })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Target Type."
            });
        });
    };
}