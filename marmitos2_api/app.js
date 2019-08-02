const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');

require('./app/config/passport/passport');

var app = express();


var authRouter = require('./routes/api/authentification');
var utilisateursRouter = require('./routes/api/utilisateurs');
var recettesRouter = require('./routes/api/recettes');

//Models
var models = require("./app/models");
//Sync Database
models.sequelize.sync().then(function() {
    console.log('Nice! Database looks fine');
}).catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!");
});

app.use(bodyParser());
app.use('/api/auth', authRouter);
app.use('/api/utilisateurs', passport.authenticate('jwt', {session: false}), utilisateursRouter);
app.use('/api/recettes', passport.authenticate('jwt', {session: false}), recettesRouter);

app.listen(8080);