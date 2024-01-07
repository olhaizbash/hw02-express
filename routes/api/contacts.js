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
  authenticate,
} = require("../../middlewares");

router
  .route("/")
  .get(authenticate, listContacts)
  .post(authenticate, checkIsExist, addContact);

router
  .route("/:id")
  .get(authenticate, checkContactId, getContactById)
  .put(authenticate, checkContactId, checkIsExistUpdate, updateContact)
  .delete(authenticate, checkContactId, removeContact);

router
  .route("/:id/favorite")
  .patch(authenticate, checkContactId, checkFavoriteUpdate, updateContact);
module.exports = router;
