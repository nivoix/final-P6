//importation de bcrypt pour hasher le mot de passe
const bcrypt = require('bcrypt');
//importation de cryptojs pour chiffrer l'email
const cryptojs = require('crypto-js');
//importation du package jwt
const jwt = require('jsonwebtoken');
//importation du model d'un utilisateur
const User = require('../models/user');
//importation de dotenv pour masquer ls clefs secretes
require('dotenv').config();

// signup pour enregistrer l'utilisateur dans la base de donnée
exports.signup = (req, res, next) => {
// chiffrer l'e-mail avant de l'envoyer dans la base de donnée
const emailCryptoJs = cryptojs.HmacSHA256(req.body.email, `${process.env.CRYPTOJS_EMAIL}`).toString();
// hasher le mot de passe avant de l'envoyer dans la base de donnée
// salt = 10, nb de fois que le mot de passe sera hasher
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
// ce qui va être enregistré dans mongodb
        const user = new User({
            email: emailCryptoJs,
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({message: 'utilisateur créé !'}))
        .catch(error => res.status(400).json({ error}))
    })
    .catch(error => res.status(500).json({error}));
};

// login pour s'identifier
exports.login = (req, res, next) => {
//chercher l'email chiffrer de l'utilisateur
    const emailCryptoJs = cryptojs.HmacSHA256(req.body.email, `${process.env.CRYPTOJS_EMAIL}`).toString();
    User.findOne({ email: emailCryptoJs })
        .then(user => {
            if (!user) {
                return res.status(401).json({message:'Paire login/mot de passe incorrecte'});
            }
// controler la validité du password
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
                    }
                    res.status(200).json({
                        userId: user._id,
                        //création du token
                        token: jwt.sign(
                            { userId: user._id},
                            process.env.TOKEN_KEY,
                            { expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};