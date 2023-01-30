const mongoose = require('mongoose');

const saucesSchema = mongoose.Schema({
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: Number, required: true },
  heat: { type: Number, require: true},
  likes: { type: Number, default : 0},
  dislikes: { type: Number, default : 0},
  usersLiked: { type: [String]},
  usersDisliked: { type: [String]}
});

module.exports = mongoose.model('sauces', saucesSchema);