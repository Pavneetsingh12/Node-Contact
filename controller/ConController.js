const AsyncHandler = require("express-async-handler");
const Contact = require("../model/contact_model");
//whenever we create api methods we always give label to that method:
// @desc Get all contacts
// @route GET /api/contacts
// @access Public
// @desc Get all contacts
// @route GET /api/contacts
// @access Public
exports.getContacts = AsyncHandler(async (req, res) => {
  const contacts = await Contact.find();
  res.status(200).json({ contacts });
});

// @desc Create new contact
// @route POST /api/contacts
// @access Private
exports.createContact = AsyncHandler(async (req, res) => {
  console.log("the request body is", req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }
  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id // Assuming req.user is populated by authentication middleware
  });
  res.status(201).json({ contact });
});
// Alias: keep backward–compatibility with routes expecting `postContact`
exports.postContact = exports.createContact;

// @desc Delete contact by ID
// @route DELETE /api/contacts/:id
// @access Private
exports.deleteContact = AsyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    return res.status(404).json({
      message: "Contact not found",
      status: "fail"
    });
  }
  if (contact.user_id.toString() !== req.user.id) {
    return res.status(403).json({
      message: "Not authorized to delete this contact",
      status: "fail"
    });
  }
  await contact.deleteOne();
  res.status(204).json({
    message: "Contact deleted successfully",
    status: "success"
  });
});

// @desc Update contact by ID
// @route PUT /api/contacts/:id
// @access Private
exports.getContact = AsyncHandler(async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id, user_id: req.user.id });
    if (!contact) {
      return res.status(404).json({
        message: "Contact not found",
        status: "fail"
      });
    }
    res.status(200).json({
      contact,
      status: "success"
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
      status: "error"
    });
  }
});

// @desc Update contact by ID
// @route PUT /api/contacts/:id
// @access Private
exports.updateContact = AsyncHandler(async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        message: "Contact not found",
        status: "fail"
      });
    }
    if (contact.user_id.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to update this contact",
        status: "fail"
      });
    }
    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({
      contact: updatedContact,
      status: "success"
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
      status: "error"  
    });
  }
});

// Duplicate deleteContact removed (already defined above)
module.exports = {
  getContacts: exports.getContacts,
  createContact: exports.createContact,
  postContact: exports.createContact,
  deleteContact: exports.deleteContact,
  getContact: exports.getContact,
  updateContact: exports.updateContact
};
