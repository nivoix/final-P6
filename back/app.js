const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require("helmet");

const saucesRoutes =require('./routes/sauce')
const userRoutes = require('./routes/user')

//importation de dotenv pour masquer la clef secrete
require('dotenv').config();

mongoose.connect(`${process.env.LOGINDB}`,
    { useNewUrlParser: true,
        useUnifiedTopology: true})
    .then(() => console.log('connexion mongodb OK !'))
    .catch(() => console.log('connexion mongodb KO ! '));

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use(
    helmet({
        crossOriginResourcePolicy: false,
    })
  );

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname,'images')));




module.exports = app;