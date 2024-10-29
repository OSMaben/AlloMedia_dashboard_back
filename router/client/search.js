const express = require('express');
const router = express.Router();
const { SearchRestaurants } = require('../../controller/clients/SearchController');
const { getRestaurantById  } = require('../../controller/clients/restaurantMenuController');
const { addItemToCart  } = require('../../controller/clients/cartController');
const { placeOrder  } = require('../../controller/clients/orderController');
const VerifyToken = require("../../middleware/VerifyToken");
router.get('/search', SearchRestaurants);

router.get('/:id', getRestaurantById);

router.post('/add', addItemToCart);

router.post('/place-order', VerifyToken,placeOrder);


module.exports = router;
