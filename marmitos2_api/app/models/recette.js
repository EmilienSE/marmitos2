"use strict";
var sequelize = require('./index');
var Ingredient = require('./Ingredient');

module.exports = function(sequelize, Sequelize) {
 
    var Recette = sequelize.define('recette', {
 
        idRecette: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
 
        nomRecette: {
            type: Sequelize.STRING,
            notEmpty: true
        },
 
        photoRecette: {
            type: Sequelize.TEXT('long')
        },
 
        typeRecette: {
            type: Sequelize.INTEGER,
            notEmpty: true
        },
 
        preparationRecette: {
            type: Sequelize.TEXT,
            allowNull: false
        },
 
        tempsPreparationRecette: {
            type: Sequelize.INTEGER,
            allowNull: false
        }, 

        tempsCuissonRecette: {
            type: Sequelize.INTEGER,
            allowNull: false
        },

        nombrePersonnesRecette: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
 
    });

    Recette.associate = function(models) {
        models.recette.belongsTo(models.utilisateur);
        models.recette.hasMany(models.ingredient);
    };

    return Recette;
 
}