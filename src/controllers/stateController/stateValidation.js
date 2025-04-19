const Joi = require("joi");

const postStateTypeReqBodyValidationSchema = Joi.object({})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "any.required": "",
    "object.base": "",
    "object.empty": "",
    "object.unknown": "",
  });

const putStateTypeReqBodyValidationSchema = Joi.object({})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "any.required": "",
    "object.base": "",
    "object.empty": "",
    "object.unknown": "",
  });

const stateTypeQueryParamsValidationSchema = Joi.string().required();

module.exports = {
  putStateTypeReqBodyValidationSchema,
  postStateTypeReqBodyValidationSchema,
  stateTypeQueryParamsValidationSchema,
};
