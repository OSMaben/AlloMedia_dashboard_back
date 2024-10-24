const RestoModel = require('../../model/Resto.model');
const  mongoose  = require('mongoose');
const User = require('../../model/user.model');
const express = require('express');
const {
    body,
    validationResult
} = require('express-validator');


const ListOrders = async (req, res) => {
    const currentUser = req.user._id;
    console.log(currentUser);

    if (!currentUser) return res.status(400).json({ error: 'Manager not found' });

    try
    {

    }catch(err)
    {

    }
}



module.exports = {
    ListOrders
}
