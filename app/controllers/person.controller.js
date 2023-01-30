
const { validationResult } = require('express-validator');
const db = require("../models");
const Person = db.persons;
const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");

module.exports = class PersonController  {
    
    /**
     * @swagger
     * tags:
     *   - name: Person
     *     description: An entity that is designed to track who a task is assigned to. More is planned in future versions.
     */
    constructor() {
        
     }
     
     /**
      * @swagger
      * /api/person:
      *     get:
      *         tags:
      *           - Person
      *         summary: returns a list of all persons
      *         description: Retrieves a list of all persons.
      *         responses:
      *             200:
      *                 description: a list of all persons ordered by last name.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         type: array
      *                         items:
      *                           $ref: '#/components/schemas/Person'
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
        
        Person.findAll({order: [ [ 'lastName', 'ASC' ]]})
            .then(data => {
                res.send(data);
            })
            .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving person."
            });
        });
    };
       
    /**
      * @swagger
      * /api/person/{id}:
      *     get:
      *         tags:
      *           - Person
      *         summary: returns a person by ID.
      *         description: Retrieves person by ID.
      *         parameters:
      *          - in: path
      *            name: id
      *            required: true
      *            description: Numeric ID of the person to retrieve.
      *            schema:
      *              type: integer
      *         responses:
      *             200:
      *                 description: a person found by specified ID.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         $ref: '#/components/schemas/Person'
      *             400:
      *                 description: validation error
      *             404:
      *                 description: Cannot find person with id={id}.
      *             500:
      *                 description: unknown error
      */
    findOne = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id;
        Person.findByPk(id)
        .then(data => {
            if (data) {
            res.send(data);
            } else {
            res.status(404).send({
                message: `Cannot find person with id=${id}.`
            });
            }
        })
        .catch(err => {
            res.status(500).send({
            message: "Error retrieving person with id=" + id
            });
        });
    };
    
    /**
      * @swagger
      * /api/person/{id}:
      *     put:
      *         tags:
      *           - Person
      *         summary: updates a person by ID.
      *         description: Updates person by ID.
      *         parameters:
      *          - in: path
      *            name: id
      *            required: true
      *            description: Numeric ID of the person to update.
      *            schema:
      *              type: integer
      *         requestBody:
      *           description: Updated Person
      *           content:
      *             application/json:
      *               schema:
      *                 $ref: '#/components/schemas/Person'
      *         responses:
      *             200:
      *                 description: Person was updated successfully.
      *             400:
      *                 description: validation error
      *             404:
      *                 description: Cannot find person with id={id}.
      *             500:
      *                 description: unknown error
      */
    update = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id;
        const person = req.body;
        Person.count({
            where: {firstName: person.firstName, lastName: person.lastName, id: {[Op.ne]: id}}
        })
        .then(num => {
            if (num> 0) {
                res.send({message: 'Person already exists.'});
            } else {
                Person.update(person, {
                    where: { id: id }
                })
                .then(num => {
                    if (num == 1) {
                        res.send({
                            success: true,
                            message: "Person was updated successfully."
                        });
                    } else {
                        res.send({
                            message: `Cannot update person with id=${id}. Maybe person was not found or req.body is empty!`
                        });
                    }
                })
                .catch(err => {
                    res.status(500).send({
                    message: "Error updating person with id=" + id
                    });
                });
            }
        })
        .catch(err => {
            res.send({message: "Some error occurred while retrieving person. " + err });
        });
    };
    
    /**
      * @swagger
      * /api/person/{id}:
      *     delete:
      *         tags:
      *           - Person
      *         summary: deletes an person by the provided ID.
      *         description: Deletes an person by the provided ID.
      *         parameters:
      *          - in: path
      *            name: id
      *            required: true
      *            description: Numeric ID of the person to delete.
      *            schema:
      *              type: integer
      *         responses:
      *             200:
      *                 description: Person was deleted successfully!
      *             400:
      *                 description: validation error
      *             404:
      *                 description: Cannot delete Person with id={id}. Maybe Person was not found!
      *             500:
      *                 description: Could not delete person with id={id}
      */
    delete = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const id = req.params.id;
        Person.destroy({
        where: { id: id }
        })
        .then(num => {
            if (num == 1) {
            res.send({
                success: true,
                message: "Person was deleted successfully!"
            });
            } else {
            res.send({
                message: `Cannot delete person with id=${id}. Maybe person was not found!`
            });
            }
        })
        .catch(err => {
            res.status(500).send({
            message: "Could not delete person with id=" + id
            });
        });
    };

    /**
      * @swagger
      * /api/person/:
      *     post:
      *         tags:
      *           - Person
      *         summary: creates an person with the provided parameters.
      *         description: Creates an person with the provided parameters
      *         requestBody:
      *            description: Person To Create
      *            required: true
      *            content:
      *              application/json:
      *                schema:
      *                  $ref: '#/components/schemas/Person'
      *         responses:
      *             200:
      *                 description: Returns the newly created person.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         $ref: '#/components/schemas/Person'              
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

        const person = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
        };
        Person.count({
            where: {firstName: person.firstName, lastName: person.lastName}
        })
        .then(num => {
            if (num> 0) {
                res.send({message: 'Person already exists.'});
            } else {
            Person.create(person)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                        message:
                        err.message || "Some error occurred while creating the Person."
                    });
                });
            }
        })
        .catch(err => {
            res.send({message: "Some error occurred while retrieving person. " + err });
        });
    };

    /**
      * @swagger
      * /api/person/name/{name}:
      *     get:
      *         tags:
      *           - Person
      *         summary: returns a person by name.
      *         description: Retrieves person by name.
      *         parameters:
      *          - in: path
      *            name: name
      *            required: true
      *            description: Name of the person to retrieve.
      *            schema:
      *              type: string
      *         responses:
      *             200:
      *                 description: a person found by specified name.
      *                 content:
      *                     application/json:
      *                       schema:
      *                         type: array
      *                         items:
      *                           $ref: '#/components/schemas/Person'
      *             400:
      *                 description: validation error
      *             500:
      *                 description: unknown error
      */
    findByName = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        const name = req.params.name;
        var condition = name ? { name: { [Op.or]: [
                        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('firstName')), 'LIKE', `%${name}%`),
                        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('lastName')), 'LIKE', `%${name}%`),
                    ] } } : null;
        Person.findAll({ where: condition, order: [ [ 'lastName', 'ASC' ]] })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving People."
            });
        });
    };
}
