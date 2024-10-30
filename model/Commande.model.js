

const mongoose = require('mongoose');

const CommandeSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  livreur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Resto', required: true },
  items: [{ name: String, quantity: Number, price: Number }],
  adress: { type: String , require:true},
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['orderd','confermed','canceld','praparing','pending', 'accepted', 'refused', 'delivered','restord']},
  refusalReason: { type: String, default: null },
  restordReason: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  deleveddAt: { type: Date, default: Date.now },
});
const Commande = mongoose.model('Commande', CommandeSchema);
module.exports = Commande;
