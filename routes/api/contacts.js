const express = require("express");

const router = express.Router();

const app = express();

app.use(express.json());

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../controllers");

const {
  checkContactId,
  checkIsExist,
  checkIsExistUpdate,
  checkFavoriteUpdate,
} = require("../../middlewares");

router.route("/").get(listContacts).post(checkIsExist, addContact);

router
  .route("/:id")
  .get(checkContactId, getContactById)
  .put(checkContactId, checkIsExistUpdate, updateContact)
  .delete(checkContactId, removeContact);

router
  .route("/:id/favorite")
  .patch(checkContactId, checkFavoriteUpdate, updateContact);
module.exports = router;
