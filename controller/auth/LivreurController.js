
const User = require("../../model/user.model");
const HashPassword = require("../../util/HashPassword");
const envoyerEmail = require("../../util/mail");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
//crud livreur

const ajoutLivreur = async (req, res) => {
data = req.body;
 try{

    const emailExiste = await User.findOne({email});
    if(emailExiste){
       return res.status(400).json({ message: 'This email exist' });
    }
     //hache password
    if (data.password) {
        data.password = await HashPassword(data.password);
      }

      //cree livreur
      const user = await User.create(data);
         
      //send email a livreur avec son mot de pass 
      await envoyerEmail(
        user.email,
        "livreur filicitation ",
        data.password,
        null,
        "livreur"
      );
  
      return res.status(201).json({
        status: "success",
        message: "A verification email has been sent to  livreur boit email .",
  
        token,
      });

 

 }catch(error){

    return res.status(400).json({
        message: "An error occurred during add livre",
        error: error.message || "Internal server error",
      });
 }
}
