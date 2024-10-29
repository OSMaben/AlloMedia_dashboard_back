const Commande = require("../../model/Commande.model");
const User=require("../../model/user.model")
const getLivreurStatistics = async (req, res) => {
  const livreurId = req.user._id; 

  try {
    
    const livreur = await User.findById(livreurId);
    if (!livreur) {
      return res.status(404).json({ message: 'Livreur not found' });
    }

    // Récupérer les commandes du livreur
    const commandes = await Commande.find({ livreur: livreurId });

    const totalCommandes = commandes.length;
    const commandesLivrees = commandes.filter(commande => commande.status === 'delivered').length;
    const commandesRefusees = commandes.filter(commande => commande.status === 'refused').length;
    const commandesAcceptees = commandes.filter(commande => commande.status === 'accepted').length;
    const  commandesRestaures = commandes.filter(commande => commande.status === 'restord').length;
    const tauxDeLivraison = totalCommandes > 0 ? (commandesLivrees / totalCommandes) * 100 : 0;

  

    // Réponse avec les statistiques
    return res.status(200).json({
      totalCommandes,
      commandesLivrees,
      commandesRefusees,
      commandesAcceptees,
      commandesRestaures,
      tauxDeLivraison: tauxDeLivraison.toFixed(2) + '%',
     
    });

  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while retrieving livreur statistics",
      error: error.message || "Internal server error",
    });
  }
};

module.exports = { getLivreurStatistics };
