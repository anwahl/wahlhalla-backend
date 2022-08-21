
const { validationResult } = require('express-validator');
const db = require("../models");
const TargetType = db.targetTypes;
const Op = db.Sequelize.Op;

module.exports = class TargetTypeController  {
    constructor() {
        
     }

     findAll = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        TargetType.findAll()
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

    findByDescription = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const description = req.params.description;
        var condition = description ? { description: { [Op.like]: `%${description}%` } } : null;
        TargetType.findAll({ where: condition })
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