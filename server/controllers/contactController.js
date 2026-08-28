const Contact = require("../models/Contact");

exports.createContact = async (req, res) => {
  try {
    const contact = await Contact.create(
      req.body
    );

    res.status(201).json({
      success: true,
      message:
        "Your message has been submitted successfully.",
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getContact = async (req, res) => {
  try {
    const contact =
      await Contact.findById(
        req.params.id
      );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found."
      });
    }

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const contact =
      await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found."
      });
    }

    res.json({
      success: true,
      message:
        "Contact message updated successfully.",
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const contact =
      await Contact.findByIdAndDelete(
        req.params.id
      );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found."
      });
    }

    res.json({
      success: true,
      message:
        "Contact message deleted successfully."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};