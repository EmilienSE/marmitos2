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


/* ADD RECETTE */
router.post('/', function(req, res, next){
	console.log(req.body);
	if(
		req.body.nomRecette === undefined || req.body.nomRecette === null ||
		req.body.photoRecette === undefined || req.body.photoRecette === null ||
		req.body.typeRecette === undefined || req.body.typeRecette === null ||
		req.body.preparationRecette === undefined || req.body.preparationRecette === null ||
		req.body.tempsPreparationRecette === undefined || req.body.tempsPreparationRecette === null ||
		req.body.tempsCuissonRecette === undefined || req.body.tempsCuissonRecette === null ||
		req.body.nombrePersonnesRecette === undefined || req.body.nombrePersonnesRecette === null
	){
		res.status(400).send({
			error : 'Un champ requis est manquant.'
		});
	} else {
		if(
			typeof req.body.typeRecette == 'number' &&
			typeof req.body.tempsCuissonRecette == 'number' &&
			typeof req.body.tempsPreparationRecette == 'number' &&
			typeof req.body.nombrePersonnesRecette == 'number'
		){
			models.recette.create({
		  	nomRecette : req.body.nomRecette,
		  	photoRecette : req.body.photoRecette,
		  	typeRecette : req.body.typeRecette,
		  	preparationRecette : req.body.preparationRecette,
		  	tempsPreparationRecette : req.body.tempsPreparationRecette,
		  	tempsCuissonRecette : req.body.tempsCuissonRecette,
		  	nombrePersonnesRecette : req.body.nombrePersonnesRecette,
		  	utilisateurIdUtilisateur : req.user.idUtilisateur
		  }).then(function(result){
		  	if(Array.isArray(req.body.quantiteIngredient)){
		  		for(var i = 0; i < req.body.quantiteIngredient.length; i++){
		  			models.ingredient.create({
							nomIngredient : req.body.nomIngredient[i],
							quantiteIngredient : parseInt(req.body.quantiteIngredient[i]),
							recetteIdRecette : result.dataValues.idRecette
						});
		  		}
		  	} else {
		    	models.ingredient.create({
						nomIngredient : req.body.nomIngredient,
						quantiteIngredient : parseInt(req.body.quantiteIngredient),
						recetteIdRecette : result.dataValues.idRecette
					});
		  	}
		  	res.send({
		  		recette : result
		  	});
		  });
		} else {
			res.status(400).send({
				error : 'Un champ requis n\'est pas de la bonne forme.'
			});
		}
		
	}
	
});

module.exports = router;