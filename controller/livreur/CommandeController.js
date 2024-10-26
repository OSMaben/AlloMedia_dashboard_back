const Commande = require("../../model/Commande.model");
const User=require("../../model/user.model")
//reffuser une commande
const refuseCommande = async (req, res) => {
  const { commandeId } = req.params; 
  const { refusalReason } = req.body; 
  const livreurId = req.user._id; 

  try {
 
    const commande = await Commande.findById(commandeId);

    if (!commande) {
      return res.status(404).json({ message: "Commande not found" });
    }

    if (commande.livreur.toString() !== livreurId.toString()) {
      return res.status(403).json({ message: "You are not authorized to refuse this commande" });
    }

    commande.status = 'refused';
    commande.refusalReason = refusalReason || "No reason provided";

    await commande.save();

    return res.status(200).json({
      status: "success",
      message: "Commande has been refused",
      data: commande
    });

  } catch (error) {
    return res.status(400).json({
      message: "An error occurred while refusing the commande",
      error: error.message || "Internal server error",
    });
  }
};


//livrer une commande


const confirmDelivery = async (req, res) => {
  const { orderId } = req.params;
  const livreurId = req.user._id; 

  try {

    const commande = await Commande.findById(orderId);

  
    if (!commande) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    // Vérifier si l'utilisateur authentifié est le livreur assigné à cette commande
    if (commande.livreur.toString() !== livreurId.toString()) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à confirmer cette livraison" });
    }

    if (commande.status === 'delivered') {
      return res.status(400).json({ message: "La commande a déjà été livrée" });
    }

    commande.status = 'delivered';
    await commande.save();

    return res.status(200).json({
      status: "success",
      message: "Livraison confirmée avec succès",
      commande
    });

  } catch (error) {
    return res.status(500).json({
      message: "Une erreur s'est produite lors de la confirmation de la livraison",
      error: error.message || "Erreur interne du serveur",
    });
  }
};


//accepter une commande



const acceptCommande = async (req, res) => {
  const { orderId } = req.params;
  const livreurId = req.user._id;

  try {
   
    const commande = await Commande.findById(orderId);

    if (!commande) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

   
    if (commande.status !== 'pending') {
      return res.status(400).json({ message: "Cette commande ne peut plus être acceptée" });
    }

    
    if (commande.livreur.toString() !== livreurId.toString()) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à accepter cette commande" });
    }

    commande.status = 'accepted';
    await commande.save();

    return res.status(200).json({
      status: "success",
      message: "Commande acceptée avec succès",
      commande
    });

  } catch (error) {
    return res.status(500).json({
      message: "Une erreur s'est produite lors de l'acceptation de la commande",
      error: error.message || "Erreur interne du serveur",
    });
  }
};


// get livreur's orders with filters
const getLivreurCommandes = async (req, res) => {
  const livreurId = req.user._id; 
  const { status = 'pending', startDate, endDate } = req.query; 

  try {
    // Préparer les filtres
    let filters = { livreur: livreurId, status }; 

    // Filtrer par date si les paramètres sont fournis
    if (startDate && endDate) {
      filters.createdAt = {
        $gte: new Date(startDate),  
        $lte: new Date(endDate),    
      };
    }

    // Rechercher les commandes selon les filtres
    const commandes = await Commande.find(filters)
                                   .populate('client') 
                                   .populate('restaurant')
                                   .exec();

   
    if (!commandes.length) {
      return res.status(404).json({ message: "Aucune commande trouvée pour ce livreur avec les filtres spécifiés." });
    }

    return res.status(200).json({
      status: "success",
      commandes,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Une erreur s'est produite lors de la récupération des commandes",
      error: error.message || "Erreur interne du serveur",
    });
  }
};




module.exports = {
  confirmDelivery,
  refuseCommande,
  acceptCommande,
  getLivreurCommandes,
};
