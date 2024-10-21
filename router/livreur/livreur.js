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
    getLivreurCommandes } = require("../../controller/livreur/CommandeController");

    const livreurMiddleware = require('../../middleware/livreurMiddleware');
 
  const router = express.Router();
  
 
  router.post('/create',livreurMiddleware, ajoutLivreur); 
  router.put('/update/:id', livreurMiddleware,updateLivreur); 
  router.delete('/delete/:id', livreurMiddleware,deleteLivreur); 
  router.get('/livreurs', livreurMiddleware,getActiveLivreurs); 
  router.patch('/restore/:id',livreurMiddleware, restoreLivreur); 
  //command 
  router.patch('/confirm-delivery/:orderId',livreurMiddleware, confirmDelivery);
  router.patch('/accept-order/:orderId', livreurMiddleware, acceptCommande);
  router.patch('/refuse-order/:orderId', livreurMiddleware, refuseCommande);
  router.get('/orders', livreurMiddleware, getLivreurCommandes);
  
  module.exports = router;
  