const express = require('express');
const router = express.Router();
const { SearchRestaurants } = require('../../controller/clients/SearchController');
const { getRestaurantById  } = require('../../controller/clients/restaurantMenuController');
const { addItemToCart  } = require('../../controller/clients/cartController');
const { placeOrder  } = require('../../controller/clients/orderController');
const { getOrderStatus  } = require('../../controller/clients/orderController');

router.get('/search', SearchRestaurants);

router.get('/:id', getRestaurantById);

router.post('/add', addItemToCart);

router.post('/place-order', placeOrder);
router.get("/track/:orderId", getOrderStatus); 


module.exports = router;
