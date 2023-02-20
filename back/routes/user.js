const express = require('express');
//importation du middleware password
const password = require('../middleware/password');
//importation du middleware controleEmail
const controleEmail = require('../middleware/controleEmail');
//la fonction router
const router = express.Router();
// importation du controller
const userCtrl = require('../controllers/user');
// les routes
router.post('/signup',password,controleEmail, userCtrl.signup);
router.post('/login', userCtrl.login);
//exportation du module
module.exports = router;