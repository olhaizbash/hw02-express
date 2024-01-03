const { Types } = require("mongoose");
const { HttpError } = require("../Errors");
const { Contact } = require("../models");
const { catchAsync, schema, schemaFav } = require("../utils");

exports.checkUserId = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const isValid = Types.ObjectId.isValid(id);
  if (!isValid) {
    throw HttpError(404, "Contact not found");
  }
  const contactExist = await Contact.exists({ _id: id });
  if (!contactExist) {
    throw HttpError(404, "Contact not found");
  }
  next();
});

exports.checkIsExist = catchAsync(async (req, res, next) => {
  const { value, error } = schema(req.body);
  if (error) {
    throw HttpError(400, "missing required name field");
  }

  // const contactExistsWithEmail = await Contact.exists({
  //   email: value.email,
  // });
  // if (contactExistsWithEmail)
  //   throw HttpError(409, "User with this email already exist");

  // const contactExistsWithName = await Contact.exists({
  //   name: value.name,
  // });
  // if (contactExistsWithName)
  //   throw HttpError(409, "User with this name already exist");

  // const contactExistsWithPhone = await Contact.exists({
  //   phone: value.phone,
  // });
  // if (contactExistsWithPhone)
  //   throw HttpError(409, "User with this phonenumber already exist");

  req.body = value;
  next();
});

exports.checkIsExistUpdate = catchAsync(async (req, res, next) => {
  const { value, error } = schema(req.body);
  if (error) {
    throw HttpError(400, "missing required name field");
  }

  // const contactExistsWithEmail = await Contact.exists({
  //   email: value.email,
  //   _id: { $ne: req.params.id },
  // });
  // if (contactExistsWithEmail)
  //   throw HttpError(409, "User with this email already exist");

  // const contactExistsWithName = await Contact.exists({
  //   name: value.name,
  //   _id: { $ne: req.params.id },
  // });
  // if (contactExistsWithName)
  //   throw HttpError(409, "User with this name already exist");

  // const contactExistsWithPhone = await Contact.exists({
  //   phone: value.phone,
  //   _id: { $ne: req.params.id },
  // });
  // if (contactExistsWithPhone)
  //   throw HttpError(409, "User with this phonenumber already exist");

  req.body = value;
  next();
});

exports.checkFavoriteUpdate = catchAsync(async (req, res, next) => {
  const { value, error } = schemaFav(req.body);
  if (error) {
    throw HttpError(400, "missing required name field");
  }
  // const contactExistsWithEmail = await Contact.exists({
  //   email: value.email,
  //   _id: { $ne: req.params.id },
  // });
  // if (contactExistsWithEmail)
  //   throw HttpError(409, "User with this email already exist");

  // const contactExistsWithName = await Contact.exists({
  //   name: value.name,
  //   _id: { $ne: req.params.id },
  // });
  // if (contactExistsWithName)
  //   throw HttpError(409, "User with this name already exist");

  // const contactExistsWithPhone = await Contact.exists({
  //   phone: value.phone,
  //   _id: { $ne: req.params.id },
  // });
  // if (contactExistsWithPhone)
  //   throw HttpError(409, "User with this phonenumber already exist");

  req.body = value;
  next();
});
