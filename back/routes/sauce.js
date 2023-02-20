const express = require('express');
// la fonction router
const router = express.Router();
//importation du middleware d'authentification
const auth = require('../middleware/auth');
//importation du middleware multer pour la gestion des fichiers image
const multer = require('../middleware/multer-config')
//importation du controller
const saucesCtrl = require('../controllers/sauce');
//les routes
router.get('/',auth, saucesCtrl.getAllSauce);
router.post('/',auth ,multer, saucesCtrl.createSauce);
router.get('/:id',auth, saucesCtrl.getOneSauce);
router.put('/:id',auth ,multer, saucesCtrl.modifySauce);
router.delete('/:id',auth, saucesCtrl.deleteSauce);
router.post('/:id/like', auth, saucesCtrl.likeSauce)
//exportation du module
module.exports = router;