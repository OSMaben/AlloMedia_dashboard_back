const RestoModel = require('../../model/Resto.model');
const  mongoose  = require('mongoose');

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

module.exports = { CreateResto };
