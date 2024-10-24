const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
            quantity: { type: Number, required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true }
        }
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, default: 'Pending', enum: ['Pending', 'Confirmed', 'Delivered', 'Canceled'] },
    deliveryAddress: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const OrderModel = mongoose.model('Order', orderSchema);

module.exports = OrderModel;
