// searchRoutes.js

const express = require('express');
const searchController = require('../controllers/Search.controller');

const router = express.Router();

// Route for searching products and restaurants
router.get('/', searchController.searchProductsAndRestaurants);

module.exports = router;
