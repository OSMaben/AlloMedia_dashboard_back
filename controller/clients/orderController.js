const Commande = require('../../model/Commande.model');

const placeOrder = async (req, res) => {


    try {

        const { userId, deliveryAddress, items, totalPrice } = req.body;

        if (!userId || !deliveryAddress || !items || !totalPrice) {
            return res.status(400).json({ error: 'User ID, delivery address, items, and total price are required' });
        }

        // Assuming you are assigning a default livreur or fetching it based on business logic
        const restaurantId = items[0]?.restaurantId; // Extract restaurant ID from the first item

        const currentUser = req.user._id;
        const { deliveryAddress, items, totalPrice } = req.body;


        if(!currentUser )
            return res.status(400).json({msg: "User Not Found"});
        if(!deliveryAddress)
            return res.status(400).json({msg: "Delivery address address are required"});
        if(!items || !items.length  === 0)
            return res.status(400).json({msg: "Please Add An Item to  cart"});
        if(!totalPrice)
            return res.status(400).json({msg: "Total price are required"});

        // console.log(currentUser)

        const livreurId = null;
        const restaurantId = items[0]?.restaurantId;


        if (!restaurantId) {
            return res.status(400).json({ error: 'Restaurant ID is required' });
        }


        // Create a new Commande
        const newOrder = new Commande({
            client: userId, // Assuming userId is the client ID

        const newOrder = new Commande({
            client: currentUser,


            restaurant: restaurantId, // Use the restaurant ID from the items
            items: items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            totalPrice: totalPrice,
            status: 'pending' // Initial status
        });

        await newOrder.save();

        res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ error: `'An internal server error occurred ${error}` });
    }
};

const getOrderStatus = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findById(orderId);  // Fetch order from database

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        return res.status(200).json({ status: order.status, orderId: order._id });
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { placeOrder , getOrderStatus};

module.exports = { placeOrder };

