const RestoModel = require("../../model/Resto.model");
const mongoose = require("mongoose");
const User = require("../../model/user.model");
const express = require("express");
const { body, validationResult } = require("express-validator");
const Notification = require("../../model/notification.model");

const CreateResto = async (req, res, io) => {
  const { restoname, bio, type, address } = req.body;
  const currentUser = req.user._id;

  console.log(currentUser);

  if (!req.files || !req.files.logo || !req.files.image_banner) {
    return res
      .status(400)
      .json({ error: "Please provide valid logo and image banner files" });
  }

  if (!mongoose.Types.ObjectId.isValid(currentUser)) {
    return res.status(400).json({ error: "Invalid manager ID format" });
  }

  try {
    const logoPath = req.files.logo[0].path;
    const imageBannerPath = req.files.image_banner[0].path;

    if (!logoPath || !imageBannerPath) {
      return res
        .status(400)
        .json({ error: "Please provide valid logo and image banner files" });
    }
    const RestoNumber = await RestoModel.countDocuments({
      managerId: currentUser,
    });
    console.log(RestoNumber);
    if (RestoNumber >= 1) {
      return res
        .status(400)
        .json({ error: "You cannot create more than 1 restaurants" });
    }

    const restoData = {
      restoname,
      logo: logoPath,
      image_banner: imageBannerPath,
      bio,
      type,
      address,
      managerId: currentUser,
    };

    const newResto = await RestoModel.create(restoData);

    const notification = new Notification({
      message: `A new restaurant has been created with the name ${restoname}.`,
      managerId: currentUser,
      admin: true,
    });

    await notification.save();

    if (notification) {
      io.to("adminRoom").emit("newRestaurantNotification", {
        message: notification.message,
        restaurant: restoname,
      });
    }

    res
      .status(201)
      .json({ message: "Resto created successfully", resto: newResto });
  } catch (error) {
    console.error("Failed to create resto:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "An internal server error occurred" });
  }
};

const AddMenuImages = async (req, res) => {
  console.log("osm ben");
  const { name, price } = req.body;
  const currentUser = req.user._id.toString();
  if (!name || !price || !currentUser) {
    return res
      .status(400)
      .json({ error: "Name, Price, and Manager ID are required" });
  }
  console.log(req.file);
  if (!req.file) {
    return res.status(400).json({ error: "Please upload a menu image" });
  }

  try {
    const imagePath = req.file.path;
    console.log(currentUser);
    const resto = await RestoModel.findOne({ managerId: currentUser });
    if (!resto) {
      return res
        .status(404)
        .json({ error: "Restaurant not found for this manager" });
    }

    resto.menu.push({
      name,
      price: parseFloat(price),
      image: imagePath,
    });

    await resto.save();

    res
      .status(201)
      .json({ message: "Menu item added successfully", menu: resto.menu });
  } catch (error) {
    console.error("Failed to add menu item:", error);
    res.status(500).json({ error: "An internal server error occurred" });
  }
};

const UpdateResto = async (req, res) => {
  const { restoname, bio, type, address } = req.body;
  const currentUser = req.user._id;

  if (!currentUser) return res.status(400).json({ error: "User Not Found" });

  try {
    const resto = await RestoModel.findOne({ managerId: currentUser });
    if (!resto)
      return res
        .status(404)
        .json({ error: "Restaurant not found for this manager" });

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

    res.status(200).json({ message: "Resto updated successfully", resto });
  } catch (error) {
    console.error("Failed to update resto:", error);
    return res.status(500).json({ error: "An internal server error occurred" });
  }
};

const UpdatingMenu = async (req, res) => {
  const { menuId, name, price } = req.body;
  const currentUser = req.user._id;
  if (!currentUser) return res.status(400).json({ error: "Manager not found" });
  if (!menuId) return res.status(400).json({ error: "Menu ID not found" });

  try {
    const resto = await RestoModel.findOne({ managerId: currentUser });
    if (!resto)
      return res
        .status(404)
        .json({ error: "Restaurant not found for this manager" });

    const menuIndex = resto.menu.findIndex(
      (item) => item._id.toString() === menuId
    );
    if (menuIndex === -1)
      return res.status(404).json({ error: "Menu item not found" });

    if (name) resto.menu[menuIndex].name = name;
    if (price) resto.menu[menuIndex].price = price;

    // console.log(req.files);
    console.log(req.files);
    if (req.files && req.files.image) {
      const image = req.files.image;
      const imagePath = `/public/${image}`;

      image.mv(`./uploads${imagePath}`, (err) => {
        if (err) {
          console.error("Image upload failed:", err);
          return res.status(500).json({ error: "Image upload failed" });
        }
      });
      console.log(imagePath);

      resto.menu[menuIndex].image = imagePath;
    }

    await resto.save();

    res.status(200).json({
      message: "Menu item updated successfully",
      updatedMenuItem: resto.menu[menuIndex],
    });
  } catch (err) {
    console.error("Failed to update menu item:", err);
    res.status(500).json({ error: "An internal server error occurred" });
  }
};

const DeleteMenu = async (req, res) => {
  const currentUser = req.user._id;
  console.log(currentUser);

  try {
    const Resto = await RestoModel.findOne({ managerId: currentUser });
    console.log(Resto);
    await Resto.deleteOne({ managerId: currentUser });
    res.status(200).send("resturant has been deleted");
  } catch (err) {
    console.log("there was an error", err);
    res.status(500).json({ err: "An internal server error occurred" });
  }
};

module.exports = {
  CreateResto,
  AddMenuImages,
  UpdateResto,
  UpdatingMenu,
  DeleteMenu,
};
