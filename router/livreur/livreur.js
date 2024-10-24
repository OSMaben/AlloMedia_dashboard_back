const express = require('express');
const { 
  ajoutLivreur, 
  updateLivreur, 
  deleteLivreur, 
  getActiveLivreurs, 
  restoreLivreur 
} = require("../../controller/livreur/LivreurController");

const {  
  confirmDelivery,
  refuseCommande,
  acceptCommande,
  getLivreurCommandes,
  getTodayLivreurCommandes
} = require("../../controller/livreur/CommandeController");

const { getLivreurStatistics } = require("../../controller/livreur/StatistiqueController");

const livreurMiddleware = require('../../middleware/livreurMiddleware');

const router = express.Router();

// Function to setup the routes and pass the io instance
module.exports = (io) => {
  // Livreur routes
  router.post('/create', livreurMiddleware, ajoutLivreur); 
  router.put('/update/:id', livreurMiddleware, updateLivreur); 
  router.delete('/delete/:id', livreurMiddleware, deleteLivreur); 
  router.get('/livreurs', livreurMiddleware, getActiveLivreurs); 
  router.patch('/restore/:id', livreurMiddleware, restoreLivreur); 

  // Commande routes (passing io to controllers)
  router.patch('/confirm-delivery/:orderId', livreurMiddleware, (req, res) => confirmDelivery(req, res, io));
  router.patch('/accept-order/:orderId', livreurMiddleware, (req, res) => acceptCommande(req, res, io));
  router.patch('/refuse-order/:orderId', livreurMiddleware, (req, res) => refuseCommande(req, res, io));
  router.get('/orders', livreurMiddleware, getLivreurCommandes);
  router.get('/commandes-today', livreurMiddleware, getTodayLivreurCommandes);

  // Statistique routes
  router.get('/statistics/:livreurId', getLivreurStatistics);

  return router; // Return the router with io instance
};
