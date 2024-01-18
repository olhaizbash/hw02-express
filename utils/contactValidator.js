const Joi = require("joi");

exports.schema = (data) =>
  Joi.object({
    name: Joi.string().min(3).max(15).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    phone: Joi.string().required(),
    favorite: Joi.boolean(),
  }).validate(data);

exports.signupValidator = (data) =>
  Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    password: Joi.string().required(),
  }).validate(data);

exports.schemaFav = (data) =>
  Joi.object({
    name: Joi.string().min(3).max(15),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    phone: Joi.string(),
    favorite: Joi.boolean().required(),
  }).validate(data);

exports.emailSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
});
