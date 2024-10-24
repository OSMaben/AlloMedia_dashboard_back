const mongoose = require('mongoose');

const CommandeSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel', required: true },
  livreur: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'RestoModel', required: true },
  items: [{ name: String, quantity: Number, price: Number }],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['orderd','confermed','canceld','praparing','pending', 'accepted', 'refused', 'delivered','restord']},
  refusalReason: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

const Commande = mongoose.model('Commande', CommandeSchema);
module.exports = Commande;
