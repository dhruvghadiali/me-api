const Joi = require("joi");

const postDistrictReqBodyValidationSchema = Joi.object({})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "any.required": "",
    "object.base": "",
    "object.empty": "",
    "object.unknown": "",
  });

const putDistrictReqBodyValidationSchema = Joi.object({})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "any.required": "",
    "object.base": "",
    "object.empty": "",
    "object.unknown": "",
  });

const districtQueryParamsValidationSchema = Joi.string().required();

module.exports = {
  putDistrictReqBodyValidationSchema,
  postDistrictReqBodyValidationSchema,
  districtQueryParamsValidationSchema,
};
