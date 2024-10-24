// controller/OrderController.js
const CartModel = require('../../model/Cart');
const OrderModel = require('../../model/Order');

const placeOrder = async (req, res) => {
    try {
        // Make sure the user information is being passed correctly
        const userId = req.body.userId;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is missing from the request' });
        }

        // Proceed with order creation
        const newOrder = new OrderModel({
            userId: userId,
            items: req.body.items,
            totalPrice: req.body.totalPrice,
            deliveryAddress: req.body.deliveryAddress,
            status: 'Pending' // Example order status
        });

        await newOrder.save();

        res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ error: `'An internal server error occurred'${error}` });
    }
};

module.exports = { placeOrder };

