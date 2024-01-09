const catchAsync = require("./catchAsync");
const { schema, schemaFav, signupValidator } = require("./contactValidator");

module.exports = {
  catchAsync,
  schema,
  schemaFav,
  signupValidator,
};
