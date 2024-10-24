const CartModel = require('../../model/Cart');
const RestoModel = require('../../model/Resto.model');

// Add item to the cart
const addItemToCart = async (req, res) => {
    try {
        const { userId } = req.body; 
        const { menuItemId, quantity } = req.body;

        const restaurant = await RestoModel.findOne({ 'menu._id': menuItemId });
        if (!restaurant) {
            return res.status(404).json({ error: 'Menu item not found Add new item' });
        }

        const menuItem = restaurant.menu.id(menuItemId);
        if (!menuItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }

        // Find the user's cart
        let cart = await CartModel.findOne({ userId });
        if (!cart) {
            cart = new CartModel({ userId, items: [], totalPrice: 0 });
        }

        // Check if item already exists in the cart
        const existingItemIndex = cart.items.findIndex(item => item.itemId.equals(menuItemId));
        if (existingItemIndex >= 0) {
            // Update quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({
                itemId: menuItem._id,
                name: menuItem.name,
                price: menuItem.price,
                quantity
            });
        }

        // Update the total price
        cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Failed to add item to cart:', error);
        res.status(500).json({ error: 'An internal server error occurred' });
    }
};


// const updateCartItem = async (req, res) => {
//     try {
//         const { userId } = req.body;
//         const { menuItemId, quantity } = req.body;

//         let cart = await CartModel.findOne({ userId });
//         if (!cart) {
//             return res.status(404).json({ error: 'Cart not found' });
//         }

//         const item = cart.items.find(item => item.itemId.equals(menuItemId));
//         if (!item) {
//             return res.status(404).json({ error: 'Item not found in cart' });
//         }

//         item.quantity = quantity;
//         cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

//         await cart.save();
//         res.status(200).json(cart);
//     } catch (error) {
//         console.error('Failed to update cart item:', error);
//         res.status(500).json({ error: 'An internal server error occurred' });
//     }
// };


// const removeItemFromCart = async (req, res) => {
//     try {
//         const { userId } = req.body;
//         const { menuItemId } = req.body;

//         let cart = await CartModel.findOne({ userId });
//         if (!cart) {
//             return res.status(404).json({ error: 'Cart not found' });
//         }

//         cart.items = cart.items.filter(item => !item.itemId.equals(menuItemId));
//         cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

//         await cart.save();
//         res.status(200).json(cart);
//     } catch (error) {
//         console.error('Failed to remove item from cart:', error);
//         res.status(500).json({ error: 'An internal server error occurred' });
//     }
// };


module.exports = { addItemToCart };
