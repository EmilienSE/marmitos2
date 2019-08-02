var express = require('express');
var router = express.Router();

//Models
var models = require("../../app/models");

/* GET ALL RECETTES BY UTILISATEUR ID */
router.get('/', function(req, res, next) {

	var response = [];

	models.recette.findAll({
		where: {
			utilisateurIdUtilisateur: req.user.idUtilisateur 
		}
	}).then(recettes => {
		var recettesProcessed = 0;
		recettes.forEach(function(recette){
			models.ingredient.findAll({
				where: {
					recetteIdRecette : recette.idRecette
				}
			})
			.then(ingredients => {
				response.push({
					recette : recette,
					ingredients : ingredients
				});
				recettesProcessed++;
				if(recettesProcessed === recettes.length){
					res.send({
						utilisateur : req.user,
						recettes : response
					});
				}
			});
		});
	});
});


/* GET RECETTE BY ID */
router.get('/:id', function(req, res, next) {
	if(!Number.isInteger(parseInt(req.params.id))){
		res.status(400).send({
			error : 'L\'id parvenu n\'est pas correct.' 
		});
	} else {
		models.recette.findOne({
			where: {
				idRecette: req.params.id 
			}
		}).then(recette => {
			console.log(recette);
			if(recette.utilisateurIdUtilisateur == req.user.idUtilisateur){
				models.ingredient.findAll({
					where: {
						recetteIdRecette : recette.idRecette
					}
				})
				.then(ingredients => {
					res.send({
						utilisateur : req.user,
						recette : recette,
						ingredients : ingredients
					});
				})
				.catch(function(err){
					res.status(400).send({
						error : err
					})
				});
			} else {
				res.status(400).send({
					error : 'La recette n\'appartient pas à l\'utilisateur.'
				});
			}
		})
		.catch(function(err){
			res.status(400).send({
				error : 'L\'id parvenu ne correspond à aucune recette.'
			});
		});
	}
});

module.exports = router;