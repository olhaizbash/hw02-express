const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("./contacts");

const {
  signup,
  login,
  logout,
  currentUser,
  updateSubscription,
  updateAvatar,
} = require("./authcontrollers");

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  signup,
  login,
  logout,
  currentUser,
  updateSubscription,
  updateAvatar,
};
