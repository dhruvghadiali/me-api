const Joi = require("joi");

const postZipcodeTypeReqBodyValidationSchema = Joi.object({})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "any.required": "",
    "object.base": "",
    "object.empty": "",
    "object.unknown": "",
  });

const putZipcodeTypeReqBodyValidationSchema = Joi.object({})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "any.required": "",
    "object.base": "",
    "object.empty": "",
    "object.unknown": "",
  });

const zipcodeTypeQueryParamsValidationSchema = Joi.string().required();

module.exports = {
  putZipcodeTypeReqBodyValidationSchema,
  postZipcodeTypeReqBodyValidationSchema,
  zipcodeTypeQueryParamsValidationSchema,
};
