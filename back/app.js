//Importation du framework express
const express = require('express');
// importer mongoose pour la base de donnée
const mongoose = require('mongoose');
const path = require('path');
const helmet = require("helmet");
const saucesRoutes =require('./routes/sauce')
const userRoutes = require('./routes/user')
//importation de dotenv pour masquer le mot de passe et le nom utilisateur pour mongodb
require('dotenv').config();
//connexion à la base de donnée mongoDB
mongoose.connect(`${process.env.LOGINDB}`,
    { useNewUrlParser: true,
        useUnifiedTopology: true})
    .then(() => console.log('connexion mongodb réussi !'))
    .catch(() => console.log('connexion mongodb échoué ! '));
//création de l'application express
const app = express();
app.use(express.json());
// middleware qui permet à toutes les demandes de toutes les origines d'accéder à votre API
// c'est-à-dire mise en place du CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
// configuration de helmet
app.use(
    helmet({
        crossOriginResourcePolicy: false,
    })
  );
// les routes
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname,'images')));
//exportation du module app.js
module.exports = app;