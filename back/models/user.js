//importation de mongoose
const mongoose = require('mongoose');
//importation de mongoose-unique-validator
const uniqueValidator = require('mongoose-unique-validator');
//Le schéma de l'utilisateur
const userSchema = mongoose.Schema ({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
});
//sécurité pour que les e-mail utilisateur soient uniques
userSchema.plugin(uniqueValidator);
// exportation du module
module.exports = mongoose.model('User', userSchema);