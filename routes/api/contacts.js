const express = require("express");

const router = express.Router();

const Joi = require("joi");

const app = express();

app.use(express.json());

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");

const { HttpError } = require("../../Errors");

const schema = Joi.object({
  name: Joi.string().min(3).max(15).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  phone: Joi.number().integer().required(),
});

router.get("/", async (req, res) => {
  const contacts = await listContacts();
  res.status(200).json(contacts);
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contactById = await getContactById(req.params.contactId);

    if (!contactById) {
      throw HttpError(404, "Not found");
    }

    res.status(200).json(contactById);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const bodyData = schema.validate(req.body);

  try {
    if (bodyData.error) {
      throw HttpError(400, "missing required name field");
    }

    const newContact = await addContact(req.body);

    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const searchContact = await getContactById(req.params.contactId);
    if (!searchContact) {
      throw HttpError(404, "Not found");
    }

    await removeContact(req.params.contactId);

    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  const id = req.params.contactId;
  const bodyData = schema.validate(req.body);

  try {
    if (bodyData.error) {
      throw HttpError(400, "missing fields");
    }

    const searchContact = await getContactById(id);
    if (!searchContact) {
      throw HttpError(404, "Not found");
    }

    const updateData = await updateContact(id, req.body);

    res.status(200).json(updateData);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
