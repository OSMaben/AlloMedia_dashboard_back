const RestoModel = require('../../model/Resto.model');

const SearchRestaurants = async (req, res) => {
    const { category, searchTerm, page = 1, limit = 10 } = req.query;
    
    if (!searchTerm || !category) {
        return res.status(400).json({ 
            error: 'Search term and category are required' 
        });
    }

    try {
        let query = {};
        
        switch (category.toLowerCase()) {
            case 'name':
                query = { 
                    restoname: { 
                        $regex: searchTerm, 
                        $options: 'i' 
                    }
                };
                break;
            
            case 'cuisine':
                query = { 
                    type: { 
                        $regex: searchTerm, 
                        $options: 'i' 
                    } 
                };
                break;
            
            case 'location':
                query = { 
                    'address': { 
                        $regex: searchTerm, 
                        $options: 'i' 
                    } 
                };
                break;
            
            default:
                return res.status(400).json({ 
                    error: 'Invalid search category' 
                });
        }

        // Calculate skip value for pagination
        const skip = (page - 1) * limit;

        // Get total count for pagination
        const total = await RestoModel.countDocuments(query);

        const restaurants = await RestoModel.find(query)
            .select('restoname type address bio logo')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ restoname: 1 });

        res.status(200).json({
            message: restaurants.length ? 'Restaurants found successfully' : 'No restaurants found',
            results: restaurants,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ 
            error: 'An error occurred while searching restaurants' 
        });
    }
};

module.exports = {
    SearchRestaurants
};