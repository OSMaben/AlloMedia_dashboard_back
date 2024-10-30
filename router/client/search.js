const express = require('express');
const router = express.Router();

const { SearchRestaurants, getRestaurants } = require('../../controller/clients/SearchController');
const { getRestaurantById } = require('../../controller/clients/restaurantMenuController');
const { addItemToCart } = require('../../controller/clients/cartController');
const { placeOrder, getOrderStatus } = require('../../controller/clients/orderController');
const { getRestaurantDetails } = require('../../controller/clients/SearchController');
const {  getRes } = require('../../controller/clients/SearchController');


const { SearchRestaurants } = require('../../controller/clients/SearchController');
const { getRestaurantById  } = require('../../controller/clients/restaurantMenuController');
const { addItemToCart  } = require('../../controller/clients/cartController');
const { placeOrder  } = require('../../controller/clients/orderController');
const VerifyToken = require("../../middleware/VerifyToken");

router.get('/search', SearchRestaurants);
router.get('/:id', getRestaurantById);
router.post('/add', addItemToCart);

router.get('/restaurants/:id', getRestaurantDetails);
router.post('/place-order', placeOrder);
router.get("/track/:orderId", getOrderStatus);
router.get("/",  getRes);

router.post('/place-order', VerifyToken,placeOrder);



module.exports = router;
