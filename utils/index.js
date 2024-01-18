const catchAsync = require("./catchAsync");
const {
  schema,
  schemaFav,
  signupValidator,
  emailSchema,
} = require("./contactValidator");
const sendEmail = require("./sendEmail");

module.exports = {
  catchAsync,
  schema,
  schemaFav,
  signupValidator,
  sendEmail,
  emailSchema,
};
