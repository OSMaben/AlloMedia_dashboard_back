
const User = require("../../model/user.model");
const HashPassword = require("../../util/HashPassword");
const envoyerEmail = require("../../util/mail");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
// dotenv.config();
//crud livreur
const ajoutLivreur = async (req, res) => {
data = req.body;
const { email, restaurantId } = data;
 try{

    const emailExiste = await User.findOne({email});
    if(emailExiste){
       return res.status(400).json({ message: 'This email exist' });
    }
     //hache password
    if (data.password) {
        data.password = await HashPassword(data.password);
      }
      // Associate the livreur with a restaurant
      data.restaurant = restaurantId;
      //cree livreur
      const user = await User.create(data);
         
      const livreur = {
        email: user.name,
        password:data.password,
      
      };
      //send email a livreur avec son mot de pass 
      await envoyerEmail(
        user.email,
        "livreur filicitation ",
        data.password,
        null,
        "livreur",
        livreur
      );
  
      return res.status(201).json({
        status: "success",
        message: "A verification email has been sent to  livreur boit email ."
      });

 

 }catch(error){

    return res.status(400).json({
        message: "An error occurred during add livre",
        error: error.message || "Internal server error",
      });
 }
}
//update livreur info
 const updateLivreur = async (req,res) => {
  const { id } = req.query;
  data=req.body
  try{
  const livreur= await User.findOne({id});
  if (!livreur) {
    return res.status(404).json({ message: 'Livreur not found' });
  }

  if (data.name) livreur.name = data.name;
  if (data.email) livreur.email = data.email;
  if (data.phoneNumber) livreur.phoneNumber = data.phoneNumber;
  if (data.password) {
    livreur.password = await HashPassword(data.password);
  }

  await livreur.save();
     
  
  }catch(error){
    return res.status(400).json({
      message: "An error occurred during update livreur",
      error: error.message || "Internal server error",
    });
  }

 }
 //delet livreur

 const deleteLivreur = async (req, res) => {
  const { id } = req.params; 

  try {
    const livreur = await User.findById(id);

    if (!livreur) {
      return res.status(404).json({ message: 'Livreur not found' });
    }

    // Soft delete
    livreur.deletedAt = new Date();

    await livreur.save();

    return res.status(200).json({
      status: "success",
      message: "Livreur has been soft-deleted successfully.",
    });

  } catch (error) {
    return res.status(400).json({
      message: "An error occurred during deleting livreur",
      error: error.message || "Internal server error",
    });
  }
};

//afficher les livreur qui sont active 
const getActiveLivreurs = async (req, res) => {
  try {
    const livreurs = await User.find({ deletedAt: null, role: "livreur" });

    return res.status(200).json({
      status: "success",
      data: livreurs,
    });

  } catch (error) {
    return res.status(400).json({
      message: "An error occurred during fetching livreurs",
      error: error.message || "Internal server error",
    });
  }
};

// reactiver un livreur
const restoreLivreur = async (req, res) => {
  const { id } = req.params;

  try {
    const livreur = await User.findById(id);

    if (!livreur || livreur.deletedAt === null) {
      return res.status(404).json({ message: 'Livreur not found or already active' });
    }

  
    livreur.deletedAt = null;

    await livreur.save();

    return res.status(200).json({
      status: "success",
      message: "Livreur has been restored successfully.",
    });

  } catch (error) {
    return res.status(400).json({
      message: "An error occurred during restoring livreur",
      error: error.message || "Internal server error",
    });
  }
};



module.exports = {
  ajoutLivreur,
  updateLivreur,
  deleteLivreur,
  getActiveLivreurs,
  restoreLivreur
};