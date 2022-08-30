
const { validationResult } = require('express-validator');
const db = require("../models");
const Target = db.targets;
const TargetType = db.targetTypes;
const Op = db.Sequelize.Op;

module.exports = class TargetController {
    constructor() {
     }

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