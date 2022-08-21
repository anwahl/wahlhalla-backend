
const { validationResult } = require('express-validator');
const db = require("../models");
const Person = db.persons;
const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");

module.exports = class PersonController  {
    constructor() {
        
     }
     
     findAll = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        Person.findAll()
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
        Person.findAll({ where: condition })
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
