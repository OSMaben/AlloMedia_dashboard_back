const User = require("../../model/user.model");
const HashPassword = require("../../util/HashPassword");
const slug = require("slug");
const envoyerEmail = require("../../util/mail");
const RestoModel = require("../../model/Resto.model");
const CreateToken = require("../../util/createToken");
const UserModel = require("../../model/user.model");
const Notification = require("../../model/notification.model");

const createUserWithRestaurant = async (req, res) => {
  try {
    const { name, email, password, restoname, phone, type } = req.body;

    const user = {
      name,
      email,
      password,
      phone,
    };

    user.role = "manager";
    user.slug = slug(user.name);

    if (user.password) {
      user.password = await HashPassword(user.password);
    }

    const managerResto = await User.create(user);

    const resto = {
      restoname,
      managerId: managerResto._id,
      isAccepted: true,
      type,
    };

    const Resto = await RestoModel.create(resto);

    const token = CreateToken({ id: managerResto._id }, "5m");

    const confirmationLink =
      "http://localhost:8080/api/auth/verifyAcount/" + token;

    const data = {
      userName: managerResto.name,
      restaurantName: Resto.restoname,
      confirmationLink,
    };

    await envoyerEmail(
      user.email,
      "verfei accoute",
      confirmationLink,
      null,
      "VRA",
      data
    );

    return res.status(201).json({
      message: "User and restaurant created successfully",
      user: managerResto,
      restaurant: Resto,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while creating the user and restaurant",
      error: error.message || "Internal server error",
    });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const id = req.params.id;
    const resto = await RestoModel.findByIdAndDelete(id);
    if (!resto) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    return res.status(200).json({
      message: "Restaurant deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while deleting the restaurant",
      error: error.message || "Internal server error",
    });
  }
};

const banneRestaurant = async (req, res) => {
  try {
    const id = req.params.id;
    const resto = await RestoModel.findByIdAndUpdate(
      id,
      { isVisible: false },
      { new: true, runValidators: true }
    );

    if (!resto) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    return res.status(200).json({
      message: "Restaurant has been banned successfully",
      restaurant: resto,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while banning the restaurant",
      error: error.message || "Internal server error",
    });
  }
};

const isActiveRestaurant = async (req, res) => {
  try {
    const id = req.params.id;
    const resto = await RestoModel.findByIdAndUpdate(
      id,
      { isVisible: true },
      { new: true, runValidators: true }
    );

    if (!resto) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    return res.status(200).json({
      message: "Restaurant has been actived  successfully",
      restaurant: resto,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while banning the restaurant",
      error: error.message || "Internal server error",
    });
  }
};

const acceptedResto = async (req, res, io) => {
  try {
    const id = req.params.id;
    const resto = await RestoModel.findById(id);

    if (!resto) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    if (resto.isAccepted) {
      return res
        .status(400)
        .json({ message: "Restaurant is already accepted" });
    }

    resto.isAccepted = true;
    await resto.save();

    const manager = await UserModel.findById(resto.managerId);
    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    manager.role = "manager";
    await manager.save();

    return res
      .status(200)
      .json({ message: "Restaurant successfully accepted" });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while accepting the restaurant",
      error: error.message || "Internal server error",
    });
  }
};

const refusedResto = async (req, res) => {
  try {
    const id = req.params.id;
    const resto = await RestoModel.findById(id);

    if (!resto) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    await resto.deleteOne();

    return res.status(200).json({
      message: "Restaurant successfully refused",
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while refusing the restaurant",
      error: error.message || "Internal server error",
    });
  }
};

const getListrestaurants = async (req, res) => {
  try {
    const restaurants = await RestoModel.find({
      isAccepted: true,
    })
      .populate("managerId", ["name", "imgProfile"])
      .select(["isDeleted", "isVisible", "restoname", "type", "logo"]);

    return res.status(200).json({
      restaurants,
    });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getUnacceptedRestaurants = async (req, res) => {
  try {
    const restaurants = await RestoModel.find({ isAccepted: false }).populate(
      "managerId",
      ["name", "email", "imgProfile"]
    );

    return res.status(200).json({
      restaurants,
    });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const createResto = async (req, res, io) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Restaurant name is required" });
  }
  const resto = { name };

  const notification = new Notification({
    message: `A new restaurant has been accepted with the name ${name}.`,
    managerId: "6710f29ba2afcd999bc870f0",
    admin: true,
  });

  await notification.save();

  if (notification) {
    io.to("adminRoom").emit("newRestaurantNotification", {
      message: notification.message,
      restaurant: resto,
    });
  }

  return res.status(201).json({
    message: `Restaurant "${resto.name}" created successfully`,
    resto,
  });
};

const getListNotification = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ admin: true })
      .populate("mangerId", ["name", "imgProfile"])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    const unreadCount = await Notification.countDocuments({
      admin: true,
      isWatch: false,
    });

    const totalNotifications = await Notification.countDocuments({
      admin: true,
    });

    return res.status(200).json({
      notifications,
      totalPages: Math.ceil(totalNotifications / limit),
      currentPage: page,
      unreadCount,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { admin: true, isWatch: false },
      { isWatch: true }
    );

    const unreadCount = await Notification.countDocuments({
      admin: true,
      isWatch: false,
    });

    return res.status(200).json({
      message: "All notifications marked as read",
      unreadCount,
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  createUserWithRestaurant,
  deleteRestaurant,
  acceptedResto,
  refusedResto,
  getListrestaurants,
  getUnacceptedRestaurants,
  createResto,
  getListNotification,
  banneRestaurant,
  markAllAsRead,
  isActiveRestaurant,
};
