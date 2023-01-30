const sauces = require('../models/sauces');
const Sauces= require('../models/sauces');
const fs = require('fs');




exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauces);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauces = new Sauces({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauces.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
      .catch(error => res.status(400).json({ error }));
  };

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauces),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    delete sauceObject.userId;
    Sauces.findOne({_id: req.params.id})
      .then((sauces) => {
        if(sauces.userId != req.auth.userId) {
          res.status(401).json({ message: 'non autorisé'});
        } else {
          Sauces.updateOne({_id: req.params.id}, { ...sauceObject, _id: req.params.id})
          .then(() => res.status(200).json({message: 'sauce modifiée!'}))
          .catch(error => res.status(401).json({ error}));
        }
      })
      .catch((error) => {
        res.status(400).json({ error});      
      });
  };

exports.deleteSauce = (req, res, next) => {
    Sauces.findOne({_id: req.params.id})
      .then(sauces => {
        if(sauces.userId != req.auth.userId) {
          res.status(401).json({message: 'non autorisé'});
        } else {
          const filename = sauces.imageUrl.split('/images/')[1];
          fs.unlik(`images/${filename}`, () =>{  
            Sauces.deleteOne({_id: req.params.id})
                .then(() => { res.status(200).json({ message:'sauce supprimée !'})})
                .catch(error => res.status(401).json({ error}));
          });
      }
  })
  .catch(error => {
    res.status(500).json({error});
  });
};

exports.getOneSauce = (req, res, next) => {
    Sauces.findOne({_id: req.params.id})
      .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(404).json({error}));
  };

exports.getAllSauce = (req, res, next) => {
    Sauces.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({error}));
  };