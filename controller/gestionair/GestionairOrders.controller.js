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

        const restaurantIds = restaurants._id;
        console.log(restaurantIds)

        
        const orders = await Commande.find({ restaurant: restaurantIds });
        console.log(orders)
        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this manager' });
        }

        res.status(200).json({ orders });
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({ error: `An internal server error occurred: ${err.message}` });
    }
};




module.exports = {
    ListOrders
}
