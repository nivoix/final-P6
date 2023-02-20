const Sauce = require('../models/sauce');
const fs = require('fs');
//exportation du module de création d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
      .catch(error => res.status(400).json({ error }));
  };
//exportation du module de modification d'une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
      .then((sauce) => {
        // si l'utilisateur N'EST PAS l'utilisateur ayant créé la sauce => PAS AUTORISE
        if(sauce.userId != req.auth.userId) {
          res.status(401).json({ message: 'non autorisé'});
        } else {
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () =>{        
          // si l'utilisateur EST l'utilisateur ayant créé la sauce => AUTORISE
            Sauce.updateOne({_id: req.params.id}, { ...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({message: 'sauce modifiée!'}))
            .catch(error => res.status(401).json({ error}));
          })
        }
      })
      .catch((error) => {
        res.status(400).json({ error});      
      });
  };
//exportation du module de suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
      .then(sauce => {
        // si l'utilisateur N'EST PAS l'utilisateur ayant créé la sauce => PAS AUTORISE
        if(sauce.userId != req.auth.userId) {
          res.status(401).json({message: 'non autorisé'});
        } else {
          // si l'utilisateur EST l'utilisateur ayant créé la sauce => AUTORISE
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () =>{  
            Sauce.deleteOne({_id: req.params.id})
                .then(() => { res.status(200).json({ message:'sauce supprimée !'})})
                .catch(error => res.status(401).json({ error}));
          });
      }
  })
  .catch(error => {
    res.status(500).json({error});
  });
};
//exportation du module de recherche d'une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
      .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}));
  };
//exportation du module de recherche de toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({error}));
  };
//exportation du module de like d'une sauces
exports.likeSauce = (req, res, next) => {
  //Si valeur du like différent de 1, -1 ou 0
  if (![1, -1, 0].includes(req.body.like)) {
    return res.status(403).send({message: 'Valeur du like invalide !'});
  }
  Sauce.findOne({_id: req.params.id})
      .then(sauce => {
        if(req.body.like === 1) {
          //si l'utilisateur n'a pas encore liké ET n'a pas encore disliké
          if( !sauce.usersLiked.includes( req.body.userId ) && !sauce.usersDisliked.includes( req.body.userId )) {
            sauce.likes++
            sauce.usersLiked.push(req.body.userId)
            sauce.save()
              .then(() => res.status(200).json({ message:'like ajouté !'}))
              .catch(error => res.status(400).json({ error }));
          }else{
            return res.status(400).json({message: `Vous n'etes pas autorisé`})
          }
        }
        else if (req.body.like === -1){
          //si l'utilisateur n'a pas encore liké ET n'a pas encore disliké
          if ( !sauce.usersDisliked.includes( req.body.userId ) && !sauce.usersLiked.includes( req.body.userId )) {
            sauce.dislikes++
            sauce.usersDisliked.push( req.body.userId)
            sauce.save()
              .then(() => res.status(200).json({ message:'dislike ajouté !'}))
              .catch(error => res.status(400).json({ error }));
          }else{
            return res.status(400).json({message: `Vous n'etes pas autorisé`})
          }
        }
        else {
          //si l'utilisateur a déjà liké
          if(sauce.usersLiked.includes (req.body.userId)) {
            sauce.likes--
            sauce.usersLiked.pull( req.body.userId)
            sauce.save()
              .then(() => res.status(200).json({ message: 'like retiré !' }))
              .catch(error => res.status(400).json({ error }));
          }
          //si l'utilisateur a déjà disliké
          if(sauce.usersDisliked.includes(req.body.userId)) {
            sauce.dislikes--
            sauce.usersDisliked.pull( req.body.userId)
            sauce.save()
              .then(() => res.status(200).json({ message: 'dislike retiré !'}))
              .catch(error => res.status(400).json({ error }));
          }
        }
      })
    .catch(error => res.status(400).json({error}))
}