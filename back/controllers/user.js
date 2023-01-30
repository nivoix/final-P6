const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/user');

exports.signup = (req, res, next) => {
    console.log(req.body);
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        console.log(hash);
        const user = new user({
            email: req.body.email,
            password: hash
        });
        console.log(user);
        user.save()
        .then(() => res.status(201).json({message: 'utilisateur créé !'}))
        .catch(error => res.status(400).json({ error}))
    })
    .catch(error => res.status(500).json({error}));
};

exports.login = (req, res, next) => {
    user.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({message:'Paire login/mot de passe incorrecte'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id},
                            RANDOM_TOKEN_SECRET,
                            { expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};