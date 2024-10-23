const express = require('express');
const router = express.Router();
const { SearchRestaurants } = require('../../controller/clients/SearchController');

router.get('/search', SearchRestaurants);

module.exports = router;
