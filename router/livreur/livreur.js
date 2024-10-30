const express = require('express');
const { 
    ajoutLivreur, 
    updateLivreur, 
    deleteLivreur, 
    getActiveLivreurs, 
    restoreLivreur ,
 getProfile } = require("../../controller/livreur/LivreurController");
  
  const {  
    confirmDelivery,
    refuseCommande,
    acceptCommande,
    getLivreurCommandes ,
    getTodayLivreurCommandes,
    getCommandeDetails,
    getPendingCommandesForLivreur,
    getAcceptedCommandesForLivreur,
    restordCommande} = require("../../controller/livreur/CommandeController");

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
  router.patch('/refuse-order/:commandeId', livreurMiddleware, (req, res) => refuseCommande(req, res, io));
  router.patch('/restord-order/:commandeId', livreurMiddleware, (req, res) => restordCommande(req, res, io));
  router.get('/orders', livreurMiddleware, getLivreurCommandes);
  router.get('/commandes-today', livreurMiddleware, getTodayLivreurCommandes);
  router.get('/detail-order/:id', livreurMiddleware, getCommandeDetails);
  router.get('/commandes-pending', livreurMiddleware, getPendingCommandesForLivreur);
  router.get('/commandes-accepted', livreurMiddleware, getAcceptedCommandesForLivreur);
  router.get('/profile', livreurMiddleware, getProfile);
 //statistique
router.get('/statistics', getLivreurStatistics);

  return router; // Return the router with io instance
};
