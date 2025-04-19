const Joi = require("joi");

const postFeeTypeReqBodyValidationSchema = Joi.object({})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "any.required": "",
    "object.base": "",
    "object.empty": "",
    "object.unknown": "",
  });

const putFeeTypeReqBodyValidationSchema = Joi.object({})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "any.required": "",
    "object.base": "",
    "object.empty": "",
    "object.unknown": "",
  });

const feeTypeQueryParamsValidationSchema = Joi.string().required();

module.exports = {
  putFeeTypeReqBodyValidationSchema,
  postFeeTypeReqBodyValidationSchema,
  feeTypeQueryParamsValidationSchema,
};
