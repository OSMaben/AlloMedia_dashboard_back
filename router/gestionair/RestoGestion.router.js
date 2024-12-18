const express = require('express');
const router = express.Router();
const { CreateResto } = require('../../controller/gestionair/gestionair.controller');
const restoValidation = require('../../validation/gestionair/ValidateRestoCreation');
const  ManagerMiddleware = require('../../middleware/managerMiddleware')
const upload = require('../../util/upload');
const {AddMenuImages}  = require('../../controller/gestionair/gestionair.controller')
const {UpdateResto,UpdatingMenu,DeleteMenu,DeleteResto,ListResto,ListMenu, AcceptMenu,RefuseMenu} = require("../../controller/gestionair/gestionair.controller");
const {ListOrders} = require("../../controller/gestionair/GestionairOrders.controller");
const VerifyToken = require("../../middleware/VerifyToken");


// creation of the resto
router.post('/createResto', upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'image_banner', maxCount: 1 }
]),ManagerMiddleware, VerifyToken, restoValidation,CreateResto);

//update of the resto
router.post('/updateResto', ManagerMiddleware,VerifyToken, UpdateResto);

//-==============================================


//adding the menu of the resto
router.post('/CreateMenu', VerifyToken,ManagerMiddleware, upload.single('image'), AddMenuImages);

//updating the menu of the resto
router.post('/updatingMenu', VerifyToken,ManagerMiddleware, UpdatingMenu)


//delete of the resto
router.post("/deleteResto",VerifyToken,ManagerMiddleware, DeleteResto );
router.post("/deleteMenu",VerifyToken,ManagerMiddleware, DeleteMenu );




//show restos
router.get('/list_Resto',VerifyToken,ManagerMiddleware ,ListResto);


//show Menus Of   A resto
router.get('/list-all-menu',VerifyToken,ManagerMiddleware ,ListMenu);



//List All Orders Of the Gestionair
router.get("/List_allMyOrders", VerifyToken,ManagerMiddleware, ListOrders);




//Accept Menu
router.get('/acceptMenu/:id', VerifyToken,ManagerMiddleware, AcceptMenu);


//Refuse Menu
router.get('/RefuseMenu/:id', VerifyToken,ManagerMiddleware, RefuseMenu);


// router.get('/listResto', VerifyToken, ManagerMiddleware, ListResto);



module.exports = router;