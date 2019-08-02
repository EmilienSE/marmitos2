"use strict";
var sequelize = require('./index');
var Recette = require('./Recette');

module.exports = function(sequelize, Sequelize) {
 
    var Ingredient = sequelize.define('ingredient', {
 
        idIngredient: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
 
        nomIngredient: {
            type: Sequelize.STRING,
            notEmpty: true
        },
 
        quantiteIngredient: {
            type: Sequelize.INTEGER,
            notEmpty: true
        }

    });

    Ingredient.associate = function(models) {
        models.ingredient.belongsTo(models.recette);
    };
 
    return Ingredient;
 
}