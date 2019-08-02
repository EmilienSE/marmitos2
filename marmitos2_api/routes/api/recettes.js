var express = require('express');
var router = express.Router();

//Models
var models = require("../../app/models");

/* GET ALL RECETTES */
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

module.exports = router;