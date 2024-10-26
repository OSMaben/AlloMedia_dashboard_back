const RestoModel = require('../../model/Resto.model');

const getRestaurantById = async (req, res) => {
    try {
        const restaurant = await RestoModel.findById(req.params.id).select('menu restoname');
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }
        res.status(200).json(restaurant);
    } catch (error) {
        console.error('Failed to retrieve restaurant:', error);
        res.status(500).json({ error: 'An internal server error occurred' });
    }
};

module.exports = { getRestaurantById };
