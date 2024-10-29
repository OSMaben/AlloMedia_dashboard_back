const Commande = require("../../model/Commande.model");
const User = require("../../model/user.model");

// Refuse an order and send notification
const refuseCommande = async (req, res, io) => {
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

    // Emit notification to the manager (assuming the manager's ID is stored in the `restaurant` object)
    io.to(commande.restaurant.managerId).emit("notification", {
      message: `Order #${commande._id} has been refused by the delivery person.`,
      status: commande.status,
    });

    return res.status(200).json({
      status: "success",
      message: "Commande has been refused",
      data: commande,
    });
  } catch (error) {
    return res.status(400).json({
      message: "An error occurred while refusing the commande",
      error: error.message || "Internal server error",
    });
  }
};
const restordCommande = async (req, res, io) => {
  const { commandeId } = req.params;
  const { restordReason } = req.body;
  const livreurId = req.user._id;

  try {
    const commande = await Commande.findById(commandeId);

    if (!commande) {
      return res.status(404).json({ message: "Commande not found" });
    }

    if (commande.livreur.toString() !== livreurId.toString()) {
      return res.status(403).json({ message: "You are not authorized to refuse this commande" });
    }

    commande.status = 'restord';
    commande.restordReason = restordReason || "No reason provided";
    await commande.save();

    
    io.to(commande.restaurant.managerId).emit("notification", {
      message: `Order #${commande._id} has been refused by the client.`,
      status: commande.status,
    });

    return res.status(200).json({
      status: "success",
      message: "Commande has been restord",
      data: commande,
    });
  } catch (error) {
    return res.status(400).json({
      message: "An error occurred while restording the commande",
      error: error.message || "Internal server error",
    });
  }
};

// Confirm delivery and send notification
const confirmDelivery = async (req, res, io) => {
  const { orderId } = req.params;
  const livreurId = req.user._id;

  try {
    const commande = await Commande.findById(orderId);

    if (!commande) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    if (commande.livreur.toString() !== livreurId.toString()) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à confirmer cette livraison" });
    }

    if (commande.status === 'delivered') {
      return res.status(400).json({ message: "La commande a déjà été livrée" });
    }

    commande.status = 'delivered';
    commande.deliveredAt = Date.now();
    await commande.save();

    // Emit notification to the manager
    io.to(commande.restaurant.managerId).emit("notification", {
      message: `Order #${commande._id} has been delivered.`,
      status: commande.status,
    });

    return res.status(200).json({
      status: "success",
      message: "Livraison confirmée avec succès",
      commande,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Une erreur s'est produite lors de la confirmation de la livraison",
      error: error.message || "Erreur interne du serveur",
    });
  }
};

// Accept an order and send notification
const acceptCommande = async (req, res, io) => {
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

    // Emit notification to the manager
    io.to(commande.restaurant.managerId).emit("notification", {
      message: `Order #${commande._id} has been accepted by the delivery person.`,
      status: commande.status,
    });

    return res.status(200).json({
      status: "success",
      message: "Commande acceptée avec succès",
      commande,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Une erreur s'est produite lors de l'acceptation de la commande ",
      error: error.message || "Erreur interne du serveur",
    });
  }
};



// get livreur's orders with filters
const getLivreurCommandes = async (req, res) => {
  const livreurId = req.user._id; 
  const { status } = req.query; 
  
  try {
    // Create filters based on the incoming request
    const filters = { livreur: livreurId };
    if (status) filters.status = status; 

    console.log("Filters used:", filters); // Log filters for debugging

    const commandes = await Commande.find(filters).populate('client').exec();

    if (!commandes.length) {
      console.log("No commandes found for:", filters);
      return res.status(404).json({ message: "Aucune commande trouvée pour ce livreur avec les filtres spécifiés." });
    }
    

    return res.status(200).json({
      status: "success",
      commandes,
    });

  } catch (error) {
    console.error("Error fetching commandes:", error); // Log error for debugging
    return res.status(500).json({
      message: "Une erreur s'est produite lors de la récupération des commandes",
      error: error.message || "Erreur interne du serveur",
    });
  }
};


const getTodayLivreurCommandes = async (req, res) => {
  const livreurId = req.user._id;
  // console.log(livreurId);

  try {
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const commandes = await Commande.find({
      livreur: livreurId,
      createdAt: { $gte: today }, 
    })
      .sort({ createdAt: 1 }) 
      .populate('client')
      .exec();
      // console.log("ffffffffffffffffffffffffffffffff",commandes);

    if (!commandes.length) {
      return res.status(404).json({ message: "Aucune commande trouvée pour aujourd'hui." });
    }

    return res.status(200).json({
      status: "success",
      commandes,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Une erreur s'est produite lors de la récupération des commandes ",
      error: error.message || "Erreur interne du serveur",
    });
  }
};



const getCommandeDetails = async (req, res) => {
  const { id } = req.params; 
  try {
 
    const commande = await Commande.findById(id)
      .populate('client', 'name phone ') 
      // .populate('restaurant', 'restoname address') 
      .exec();

    if (!commande) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    return res.status(200).json({
      status: "success",
      commande,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération des détails de la commande",
      error: error.message,
    });
  }
};


async function getPendingCommandesForLivreur(req, res) {
  const livreurId = req.user._id;
  try {
    const pendingCommandes = await Commande.find({
      livreur: livreurId,
      status: 'pending'
    }).populate('client'); 

    return res.status(200).json({
      status: "success",
      pendingCommandes,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération des commandes pending",
      error: error.message,
    });
  }
}


async function getAcceptedCommandesForLivreur(req, res) {
  const livreurId = req.user._id;
  try {
    const pendingCommandes = await Commande.find({
      livreur: livreurId,
      status: 'accepted'
    }).populate('client'); 

    return res.status(200).json({
      status: "success",
      pendingCommandes,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération des commandes accepted",
      error: error.message,
    });
  }
}





module.exports = {
  confirmDelivery,
  restordCommande,
  refuseCommande,
  acceptCommande,
  getLivreurCommandes,
  getTodayLivreurCommandes,
  getCommandeDetails,
  getPendingCommandesForLivreur,
  getAcceptedCommandesForLivreur
};
