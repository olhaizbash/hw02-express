const { Contact } = require("../models");
const { catchAsync } = require("../utils");
const { HttpError } = require("../Errors");

exports.listContacts = catchAsync(async (req, res) => {
  const contacts = await Contact.find();

  res.status(200).json(contacts);
});

exports.getContactById = catchAsync(async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;

  const filter = { owner };

  if (favorite !== undefined) {
    filter.favorite = favorite === "true";
  }

  const contactById = await Contact.find(filter, "-createdAt -updatedAt", {
    skip,
    limit,
  });

  res.status(200).json(contactById);
});

exports.removeContact = catchAsync(async (req, res) => {
  const { id } = req.params;
  await Contact.findByIdAndDelete(id);

  res.status(200).json({ message: "contact deleted" });
});

exports.addContact = catchAsync(async (req, res) => {
  const { _id: owner } = req.user;
  const newContact = await Contact.create({ ...req.body, owner });

  res.status(201).json(newContact);
});

exports.updateContact = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, favorite } = req.body;
  const updateContact = await Contact.findByIdAndUpdate(
    id,
    { name, email, phone, favorite },
    { new: true }
  );

  res.status(200).json(updateContact);
});
