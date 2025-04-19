const Joi = require("joi");

const postEducationBoardReqBodyValidationSchema = Joi.object({})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "any.required": "",
    "object.base": "",
    "object.empty": "",
    "object.unknown": "",
  });

const putEducationBoardReqBodyValidationSchema = Joi.object({})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "any.required": "",
    "object.base": "",
    "object.empty": "",
    "object.unknown": "",
  });

const educationBoardQueryParamsValidationSchema = Joi.string().required();

module.exports = {
  putEducationBoardReqBodyValidationSchema,
  postEducationBoardReqBodyValidationSchema,
  educationBoardQueryParamsValidationSchema,
};
