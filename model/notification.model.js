const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    mangerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isWatch: { type: Boolean, default: false },
    admin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
