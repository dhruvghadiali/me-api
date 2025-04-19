const Joi = require("joi");

const postCityReqBodyValidationSchema = Joi.object({})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "any.required": "",
    "object.base": "",
    "object.empty": "",
    "object.unknown": "",
  });

const putCityReqBodyValidationSchema = Joi.object({})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "any.required": "",
    "object.base": "",
    "object.empty": "",
    "object.unknown": "",
  });

const cityQueryParamsValidationSchema = Joi.string().required();

module.exports = {
  putCityReqBodyValidationSchema,
  postCityReqBodyValidationSchema,
  cityQueryParamsValidationSchema,
};
