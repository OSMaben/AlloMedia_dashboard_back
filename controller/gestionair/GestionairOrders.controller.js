const RestoModel = require('../../model/Resto.model');
const  mongoose  = require('mongoose');
const User = require('../../model/user.model');
const express = require('express');
const {
    body,
    validationResult
} = require('express-validator');

const Commande = require('../../model/Commande.model');




const ListOrders = async (req, res) => {
    const currentUser = req.user._id;

    if (!currentUser) {
        return res.status(400).json({ error: 'Manager not found' });
    }

    try {
        const restaurants = await RestoModel.findOne({ managerId: currentUser });

        if (!restaurants) {
            return res.status(404).json({ message: 'No restaurant found for this manager' });
        }

        const restaurantIds = restaurants._id;
        console.log(restaurantIds);

        // Fetch orders and populate client data
        const orders = await Commande.find({ restaurant: restaurantIds }).populate('client'); // Populating client details
        console.log(orders);

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this manager' });
        }

        // Format the orders to include the necessary client information
        const formattedOrders = orders.map(order => ({
            _id: order._id,
            items: order.items,
            totalPrice: order.totalPrice,
            status: order.status,
            client: {
                name: order.client.name,
                phone: order.client.phone, // Adjust as necessary
                email: order.client.email, // Adjust as necessary
            },
            createdAt: order.createdAt
        }));

        res.status(200).json({ orders: formattedOrders });
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({ error: `An internal server error occurred: ${err.message}` });
    }
};


module.exports = {
    ListOrders
}
