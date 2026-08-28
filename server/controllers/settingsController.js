const Settings = require("../models/Settings");

// ========================================
// GET SETTINGS
// ========================================

const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error(
      "GET SETTINGS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
    });
  }
};

// ========================================
// UPDATE SETTINGS
// ========================================

const updateSettings = async (req, res) => {
  try {
    console.log("SETTINGS BODY:", req.body);
    console.log("SETTINGS FILES:", req.files);

    const {
      siteName,
      email,
      phone,
      address,
      map,
      facebook,
      instagram,
      twitter,
      linkedin,
      youtube,
    } = req.body;

    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings();
    }

    // Text fields
    settings.siteName = siteName || "";
    settings.email = email || "";
    settings.phone = phone || "";
    settings.address = address || "";
    settings.map = map || "";

    settings.facebook = facebook || "";
    settings.instagram = instagram || "";
    settings.twitter = twitter || "";
    settings.linkedin = linkedin || "";
    settings.youtube = youtube || "";

    // Logo
    if (
      req.files &&
      req.files.logo &&
      req.files.logo[0]
    ) {
      settings.logo =
        `/uploads/${req.files.logo[0].filename}`;
    }

    // Favicon
    if (
      req.files &&
      req.files.favicon &&
      req.files.favicon[0]
    ) {
      settings.favicon =
        `/uploads/${req.files.favicon[0].filename}`;
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: settings,
    });
  } catch (error) {
    console.error(
      "UPDATE SETTINGS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update settings",
      error: error.message,
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};