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


const UpdateResto = async (req, res) => {
    const { restoname, bio, type, address, managerId } = req.body;

    if (!managerId) return res.status(400).json({ error: 'User Not Found' });
    console.log(managerId);
    try {
        const resto = await RestoModel.findOne({ managerId });

        if (!resto) return res.status(404).json({ error: 'Restaurant not found for this manager' });

        if (restoname) resto.restoname = restoname;
        if (bio) resto.bio = bio;
        if (type) resto.type = type;
        if (address) resto.address = address;

        console.log(req.files);
        if (req.files) {
            if (req.files.logo) {
                const logoPath = Update(req.files.logo[0].path);
                resto.logo = { url: logoPath };
            }
            if (req.files.image_banner) {
                const imageBannerPath = Update(req.files.image_banner[0].path);
                resto.image_banner = { url: imageBannerPath };
            }
        }

        await resto.save();

        res.status(200).json({ message: 'Resto updated successfully', resto });

    } catch (error) {
        console.error('Failed to update resto:', error);
        return res.status(500).json({ error: 'An internal server error occurred' });
    }
};


module.exports = {
    CreateResto,
    AddMenuImages,
    UpdateResto
};
