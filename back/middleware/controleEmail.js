const validator = require('validator');
//exportation du module de controle de l'email
module.exports = (req, res, next) => {
    const{email} = req.body;

    if(validator.isEmail(email)){
        next()
    }else{
        return res.status(400).json({message: `l'e-mail n'est pas valide`})
    }
}