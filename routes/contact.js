const express = require("express");
const router = express.Router();

const {
  getContacts,
  updateContact,
  deleteContact,
  postContact
} = require("../controller/ConController");

router
  .route("/")
  .get(getContacts)
  .post(postContact);

router
  .route("/:id")
  .put(updateContact)
  .delete(deleteContact);

module.exports = router;