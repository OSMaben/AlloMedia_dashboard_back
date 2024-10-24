const express = require('express');
const router = express.Router();
const { CreateResto } = require('../../controller/gestionair/gestionair.controller');
const restoValidation = require('../../validation/gestionair/ValidateRestoCreation');
const  ManagerMiddleware = require('../../middleware/managerMiddleware')
const upload = require('../../util/upload');
const {AddMenuImages}  = require('../../controller/gestionair/gestionair.controller')
const {UpdateResto,UpdatingMenu,DeleteMenu} = require("../../controller/gestionair/gestionair.controller");
const VerifyToken = require("../../middleware/VerifyToken");



//creation of the resto
// router.post('/createResto', upload.fields([
//     { name: 'logo', maxCount: 1 },
//     { name: 'image_banner', maxCount: 1 }
// ]),ManagerMiddleware, VerifyToken, restoValidation,CreateResto);

//update of the resto
router.post('/updateResto', ManagerMiddleware,VerifyToken, UpdateResto);

//-==============================================


//adding the menu of the resto
router.post('/addingMenuImages', VerifyToken,ManagerMiddleware, upload.single('image'), AddMenuImages);

//updating the menu of the resto
router.post('/updatingMenu', VerifyToken,ManagerMiddleware, UpdatingMenu)


//delete of the resto
router.post("/deleteMenu",VerifyToken,ManagerMiddleware, DeleteMenu );


module.exports = router;