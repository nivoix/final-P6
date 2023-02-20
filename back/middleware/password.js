//importation du password validator
const passwordvalidator = require('password-validator');
// création du schéma
const passwordSchema = new passwordvalidator();
//le schéma du mot de passe
passwordSchema
.is().min(5)                                    // Minimum length 5
.is().max(100)                                  // Maximum length 100
.has().uppercase(1)                             // Must have one uppercase letter
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
//exportation du module de controle du mot de passe
module.exports = (req, res, next) => {
    if(passwordSchema.validate(req.body.password)){
    next()
    }else{
        return res.status(400).json({message : `le mot de passe doit contenir 5 caractères minimum dont 1 majuscule et 2 chiffres`})
    }
}