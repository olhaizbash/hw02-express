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
  checkUserId,
  checkIsExist,
  checkIsExistUpdate,
  checkFavoriteUpdate,
} = require("../../middlewares");

router.route("/").get(listContacts).post(checkIsExist, addContact);

router
  .route("/:id")
  .get(checkUserId, getContactById)
  .put(checkUserId, checkIsExistUpdate, updateContact)
  .delete(checkUserId, removeContact);

router
  .route("/:id/favorite")
  .patch(checkUserId, checkFavoriteUpdate, updateContact);

module.exports = router;
