const express = require('express');
const router = express.Router();
const { CreateResto } = require('../../controller/gestionair/gestionair.controller');
const restoValidation = require('../../validation/gestionair/ValidateRestoCreation');
const  ManagerMiddleware = require('../../middleware/managerMiddleware')
const upload = require('../../util/upload');
const {AddMenuImages}  = require('../../controller/gestionair/gestionair.controller')


//creation of the resto
router.post('/createResto', upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'image_banner', maxCount: 1 }
]),ManagerMiddleware, CreateResto);

//adding the menu of the resto
router.post('/addingMenuImages', ManagerMiddleware, upload.single('image'), AddMenuImages);



//update of the resto
// router.post('/updateResto'));
module.exports = router;