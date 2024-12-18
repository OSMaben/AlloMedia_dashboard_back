const mongoose = require("mongoose");

const RestoSchema = new mongoose.Schema(
  {
    restoname: {
      type: String,
      trim: true,
      required: [true, "name required"],
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name must be less than 50 characters"],
    },
    logo: {
      type: Object,
      default: {
        url: "https://toohotel.com/wp-content/uploads/2022/09/TOO_restaurant_Panoramique_vue_Paris_nuit_v2-scaled.jpg",
        id: null,
      },
    },
    image_banner: {
      type: Object,
      default: {
        url: "https://toohotel.com/wp-content/uploads/2022/09/TOO_restaurant_Panoramique_vue_Paris_nuit_v2-scaled.jpg",
        id: null,
      },
    },
    bio: {
      type: String,
      trim: true,
      minlength: [2, "Bio must be at least 2 characters long"],
      maxlength: [50, "Bio must be less than 50 characters"],
    },

    menu: [
      {
        name: {
          type: String,
          required: [true, "Menu item name required"],
        },
        price: {
          type: Number,
          required: [true, "Menu item price required"],
        },
        image: {
         type: String,
          default: "https://via.placeholder.com/150"
        },
      },
    ],
    type: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
    },
    isVisible: { type: Boolean, default: true },
    isDeleted:{ type: Boolean, default: false },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Manager ID required"],
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const RestoModel = mongoose.model("Resto", RestoSchema);

module.exports = RestoModel;
