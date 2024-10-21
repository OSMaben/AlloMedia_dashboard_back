const express = require("express");
const router = express.Router();


const { ajoutLivreur } = require("../../controller/livreur/LivreurController");

router.post('/creat', ajoutLivreur); 

module.exports = router;
