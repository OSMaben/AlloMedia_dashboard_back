const UserModel = require("../model/user.model");
const User = require("../model/user.model");
const path = require("path");

const getLocalFileUrl = (filePath, req) => {
  return `${req.protocol}://${req.get("host")}/uploads/${path.basename(
    filePath
  )}`;
};

const uplodProfileImage = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Veuillez télécharger une image." });
    }

    const fileUrl = getLocalFileUrl(req.file.path, req);

    user.imgProfile = {
      url: fileUrl,
      id: null,
    };

    await user.save();

    res.status(200).json({
      message: "Image téléchargée avec succès.",
      user,
      file: {
        name: req.file.filename,
        url: fileUrl,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (error) {
    console.log("Error during profile image upload:", error);
    res.status(500).json({ error: error.message });
  }
};

const uplodBannerImage = async (req, res) => {
  try {
    const user = req.user;
    if (!req.file) {
      return res.status(400).json({ error: "Veuillez télécharger une image." });
    }

    console.log(req.file.path);

    const fileUrl = getLocalFileUrl(req.file.path, req);

    console.log("====================================");
    console.log(req.file);
    console.log("====================================");

    user.imgProfileBanner.url = req.body.url;

    await user.save();

    res.status(200).json({
      message: "Image téléchargée avec succès.",
      file: {
        name: req.file.filename,
        url: fileUrl,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uplodProfileImage,
  uplodBannerImage,
};
