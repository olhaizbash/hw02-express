const fs = require("fs/promises");
const path = require("path");
const contactsPath = path.join(__dirname, "contacts.json");
const { nanoid } = require("nanoid");

const listContacts = async () => {
  const contactsRead = await fs.readFile(contactsPath);
  const contacts = JSON.parse(contactsRead);
  return contacts;
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const contactFind = contacts.find((contact) => contact.id === contactId);
  if (!contactFind) {
    return null;
  }
  return contactFind;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const contactDelete = contacts.filter((contact) => contact.id === contactId);
  if (contactDelete === undefined) {
    return null;
  }
  const newContacts = contacts.filter((contact) => contact.id !== contactId);
  await fs.writeFile(contactsPath, JSON.stringify(newContacts), {
    encoding: "utf8",
    flag: "w",
  });
  return contactDelete;
};

const addContact = async ({ name, email, phone }) => {
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  const contacts = await listContacts();
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts), {
    encoding: "utf8",
    flag: "w",
  });
  return newContact;
};

const updateContact = async (contactId, { name, email, phone }) => {
  const contacts = await listContacts();

  const updatedContact = { id: contactId, name, email, phone };

  const index = contacts.findIndex((contact) => contact.id === contactId);
  const newContacts = [...contacts];
  newContacts[index] = updatedContact;

  await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2));

  return updatedContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
