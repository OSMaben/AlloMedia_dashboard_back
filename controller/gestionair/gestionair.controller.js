const RestoModel = require('../../model/Resto.model');
const  mongoose  = require('mongoose');
const User = require('../../model/user.model');


const CreateResto = async (req, res) => {
    const { id, restoname, bio, type, address, managerId } = req.body;



    if (!req.files || !req.files.logo || !req.files.image_banner) {
        return res.status(400).json({ error: 'Please provide valid logo and image banner files' });
    }

    if (!restoname || !bio || !type || !address || !managerId  ) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    if (!mongoose.Types.ObjectId.isValid(managerId)) {
        return res.status(400).json({ error: 'Invalid manager ID format' });
    }

    try {
        const logoPath = req.files.logo[0].path;
        const imageBannerPath = req.files.image_banner[0].path;

        if(!logoPath || !imageBannerPath)
        {
            return res.status(400).json({ error: 'Please provide valid logo and image banner files' });
        }

        const restoData = {
            id,
            restoname,
            logo: logoPath,
            image_banner: imageBannerPath,
            bio,
            type,
            address,
            managerId,
        };

        const newResto = await RestoModel.create(restoData);
        res.status(201).json({ message: 'Resto created successfully', resto: newResto });
    } catch (error) {
        console.error('Failed to create resto:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'An internal server error occurred' });
    }
};


const AddMenuImages = async (req, res) => {
    console.log("osm ben")
    const { name, price, managerId } = req.body;

    if (!name || !price || !managerId) {
        return res.status(400).json({ error: 'Name, Price, and Manager ID are required' });
    }
    console.log(req.file);
    if (!req.file) {
        return res.status(400).json({ error: 'Please upload a menu image' });
    }

    try {
        const imagePath = req.file.path;

        const resto = await RestoModel.findOne({ managerId });

        if (!resto) {
            return res.status(404).json({ error: 'Restaurant not found for this manager' });
        }

        resto.menu.push({
            name,
            price: parseFloat(price),
            image: imagePath,
        });

        await resto.save();

        res.status(201).json({ message: 'Menu item added successfully', menu: resto.menu });
    } catch (error) {
        console.error('Failed to add menu item:', error);
        res.status(500).json({ error: 'An internal server error occurred' });
    }
};


module.exports = {
    CreateResto,
    AddMenuImages
};
