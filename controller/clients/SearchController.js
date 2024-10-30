const  RestoModel = require("../../model/Resto.model");

const mongoose = require("mongoose"); 

const SearchRestaurants = async (req, res) => {
  const { category, searchTerm, page = 1, limit = 10 } = req.query;

  if (!searchTerm || !category) {
    return res
      .status(400)
      .json({ error: "Search term and category are required" });
  }

  try {
    let query = {};

    switch (category.toLowerCase()) {
      case "name":
        query = { restoname: { $regex: searchTerm, $options: "i" } };
        break;

      case "cuisine":
        query = { type: { $regex: searchTerm, $options: "i" } };
        break;

      case "location":
        query = { address: { $regex: searchTerm, $options: "i" } };
        break;

      default:
        return res.status(400).json({ error: "Invalid search category" });
    }

    const skip = (page - 1) * limit;
    const total = await RestoModel.countDocuments(query);

    const restaurants = await RestoModel.find(query)
      .select("restoname type address bio logo")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ restoname: 1 });

    res.status(200).json({
      message: restaurants.length
        ? "Restaurants found successfully"
        : "No restaurants found",
      results: restaurants,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while searching restaurants" });
  }
};

// Fetch a single restaurant by ID
const getRestaurantDetails = async (req, res) => {
  try {
    const restaurantId = req.params.id;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ error: "Invalid restaurant ID" });
    }

    // Find the restaurant by ID
    const restaurant = await RestoModel.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    res.status(500).json({ error: "Failed to fetch restaurant details" });
  }
};

const getRes = async (req, res) => {
  try {
    console.log("Fetching all restaurants");
    const restaurants = await RestoModel.find();
    res.status(200).json(restaurants);
  }
   catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ error: `Failed to fetch restaurant details: ${error.message}` });
  }
};


module.exports = {
  SearchRestaurants,
  getRestaurantDetails,
  getRes
};
