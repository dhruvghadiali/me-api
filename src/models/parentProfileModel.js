const _ = require("lodash");
const moment = require("moment");
const mongoose = require("mongoose");

const { Schema } = mongoose;

const { isActiveUserValidator } = require("@MEUtils/dbQuery");
const { emailRegex, phoneRegex } = require("@MEHelpers/regex");
const {
  PARENT_OCCUPATIONS_IN,
  EDUCATION_LEVELS_IN,
} = require("@ME/helpers/enums/studentEnums");
const {
  emailMaxChar,
  emailMinChar,
  lastNameMaxChar,
  lastNameMinChar,
  phoneNumberChar,
  firstNameMaxChar,
  firstNameMinChar,
  aadhaarNumberChar,
  parentProfileAnnualIncomeMinValue,
  parentProfileAnnualIncomeMaxValue,
  parentProfileCaringChildByMinChar,
  parentProfileCaringChildByMaxChar,
} = require("@MEHelpers/validationConst");
const {
  usernameInvalid,
  usernameRequired,
  emailInvalid,
  emailRequired,
  emailMaxLength,
  emailMinLength,
  lastNameRequired,
  lastNameMaxLength,
  lastNameMinLength,
  firstNameRequired,
  firstNameMaxLength,
  firstNameMinLength,
  phoneNumberInvalid,
  phoneNumberRequired,
  phoneNumberMaxLength,
  phoneNumberMinLength,
  aadhaarNumberRequired,
  aadhaarNumberMaxLength,
  aadhaarNumberMinLength,
  parentProfileAnnualIncomeRequired,
  parentProfileAnnualIncomeInvalid,
  parentProfileOccupationInvalid,
  parentProfileEducationInvalid,
  parentProfileDateOfDeathInvalid,
  parentProfileCaringChildByMinLength,
  parentProfileCaringChildByMaxLength,
  parentProfileCaringChildByRequired,
} = require("@MEHelpers/validationMessage");

const parentProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, usernameRequired],
      validate: {
        validator: isActiveUserValidator,
        message: usernameInvalid,
      },
    },
    first_name: {
      type: String,
      trim: true,
      required: [true, firstNameRequired],
      maxlength: [firstNameMaxChar, firstNameMaxLength],
      minlength: [firstNameMinChar, firstNameMinLength],
    },
    last_name: {
      type: String,
      trim: true,
      required: [true, lastNameRequired],
      maxlength: [lastNameMaxChar, lastNameMaxLength],
      minlength: [lastNameMinChar, lastNameMinLength],
    },
    phone_number: {
      type: String,
      trim: true,
      required: [true, phoneNumberRequired],
      maxlength: [phoneNumberChar, phoneNumberMaxLength],
      minlength: [phoneNumberChar, phoneNumberMinLength],
      match: [phoneRegex, phoneNumberInvalid],
    },
    email: {
      type: String,
      trim: true,
      required: [true, emailRequired],
      maxlength: [emailMaxChar, emailMaxLength],
      minlength: [emailMinChar, emailMinLength],
      match: [emailRegex, emailInvalid],
    },
    aadhaar_number: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, aadhaarNumberRequired],
      maxlength: [aadhaarNumberChar, aadhaarNumberMaxLength],
      minlength: [aadhaarNumberChar, aadhaarNumberMinLength],
    },
    occupation: {
      type: String,
      trim: true,
      lowercase: true,
      enum: {
        values: Object.values(PARENT_OCCUPATIONS_IN),
        message: parentProfileOccupationInvalid,
      },
    },
    education: {
      type: String,
      trim: true,
      lowercase: true,
      enum: {
        values: Object.values(EDUCATION_LEVELS_IN),
        message: parentProfileEducationInvalid,
      },
    },
    annual_income: {
      type: Number,
      required: [true, parentProfileAnnualIncomeRequired],
      validate: {
        validator: function (val) {
          if (val === null || val === undefined) return false;
          return (
            val > parentProfileAnnualIncomeMinValue &&
            val < parentProfileAnnualIncomeMaxValue
          );
        },
        message: parentProfileAnnualIncomeInvalid,
      },
    },
    alive: {
      status: { type: Boolean, default: true },
      date_of_death: {
        type: Date,
        required: false,
        validate: {
          validator: function (val) {
            if (!this || this.alive.status === true) return true;
            if (!val) return false;
            const deathDate = moment(val).startOf("day");
            const today = moment().startOf("day");
            return deathDate.isBefore(today);
          },
          message: parentProfileDateOfDeathInvalid,
        },
      },
      caring_child_by: {
        type: String,
        trim: true,
        required: false,
        minlength: [
          parentProfileCaringChildByMinChar,
          parentProfileCaringChildByMinLength,
        ],
        maxlength: [
          parentProfileCaringChildByMaxChar,
          parentProfileCaringChildByMaxLength,
        ],
        validate: {
          validator: function (val) {
            if (!this || this.alive.status === true) return true;
            return _.isString(val) && !_.isEmpty(val.trim());
          },
          message: parentProfileCaringChildByRequired,
        },
      },
    },
    same_address_as_student: { type: Boolean, default: true },
    address_override: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "address",
      required: false,
    },
    is_active: { type: Boolean, default: true },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, usernameRequired],
      validate: {
        validator: isActiveUserValidator,
        message: usernameInvalid,
      },
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, usernameRequired],
      validate: {
        validator: isActiveUserValidator,
        message: usernameInvalid,
      },
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

parentProfileSchema.set("toJSON", {
  virtuals: true,
  transform: function (_, response) {
    if (
      _.get(response, "created_by.first_name") &&
      _.get(response, "created_by.last_name")
    ) {
      response.created_by = `${response.created_by.first_name} ${response.created_by.last_name}`;
    } else {
      delete response.created_by;
    }

    if (
      _.get(response, "updated_by.first_name") &&
      _.get(response, "updated_by.last_name")
    ) {
      response.updated_by = `${response.updated_by.first_name} ${response.updated_by.last_name}`;
    } else {
      delete response.updated_by;
    }
    return response;
  },
});
parentProfileSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("parent_profile", parentProfileSchema);
