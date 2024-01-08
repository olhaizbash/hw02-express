const { Contact } = require("../models");
const { catchAsync } = require("../utils");

exports.listContacts = catchAsync(async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;

  const filter = { owner };

  if (favorite !== undefined) {
    filter.favorite = favorite === "true";
  }

  const contacts = await Contact.find(filter, "-createdAt -updatedAt", {
    skip,
    limit,
  });
  res.status(200).json(contacts);
});

exports.getContactById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const contactById = await Contact.findOne({ _id: id });

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
  const updateContact = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(200).json(updateContact);
});
