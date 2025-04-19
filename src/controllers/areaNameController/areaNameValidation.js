const Joi = require("joi");

const postAreaNameReqBodyValidationSchema = Joi.object({})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "any.required": "",
    "object.base": "",
    "object.empty": "",
    "object.unknown": "",
  });

const putAreaNameReqBodyValidationSchema = Joi.object({})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "any.required": "",
    "object.base": "",
    "object.empty": "",
    "object.unknown": "",
  });

const areaNameQueryParamsValidationSchema = Joi.string().required();

module.exports = {
  putAreaNameReqBodyValidationSchema,
  postAreaNameReqBodyValidationSchema,
  areaNameQueryParamsValidationSchema,
};
