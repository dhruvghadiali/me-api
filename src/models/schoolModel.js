const moment = require("moment");
const mongoose = require("mongoose");

const {
  emailRegex,
  phoneRegex,
  youtubeURLRegex,
  websiteURLRegex,
  twitterURLRegex,
  facebookURLRegex,
  instagramURLRegex,
} = require("@MEHelpers/regex");
const {
  isActiveUserValidator,
  isActiveSchoolTypeExistsValidator,
  isActiveEducationBoardExistsValidator,
} = require("@MEUtils/dbQuery");
const {
  emailMinChar,
  emailMaxChar,
  phoneNumberChar,
  schoolNameMaxChar,
  schoolNameMinChar,
  schoolLogoMinChar,
  schoolLogoMaxChar,
  schoolAboutMaxChar,
  schoolAboutMinChar,
  schoolShortNameMaxChar,
  schoolShortNameMinChar,
  schoolAffiliateNumberMaxChar,
  schoolAffiliateNumberMinChar,
  schoolEducationBoardsMaxLimit,
  schoolEstablishedYearMinNumber,
} = require("@MEHelpers/validationConst");
const {
  emailInvalid,
  emailRequired,
  emailMaxLength,
  emailMinLength,
  usernameInvalid,
  usernameRequired,
  schoolWebsiteURL,
  youtubeURLPattern,
  twitterURLPattern,
  facebookURLPattern,
  phoneNumberInvalid,
  schoolNameRequired,
  schoolTypeIdInvalid,
  schoolNameMaxLength,
  schoolNameMinLength,
  phoneNumberRequired,
  schoolLogoMaxLength,
  schoolLogoMinLength,
  instagramURLPattern,
  phoneNumberMaxLength,
  phoneNumberMinLength,
  schoolTypeIdRequired,
  schoolAboutMaxLength,
  schoolAboutMinLength,
  educationBoardIdInvalid,
  schoolShortNameRequired,
  schoolShortNameMaxLength,
  schoolShortNameMinLength,
  organizationNameRequired,
  schoolEstablishedYearMaxYear,
  schoolEstablishedYearMinYear,
  schoolEstablishedYearRequired,
  schoolAffiliateNumberRequired,
  schoolEducationBoardsRequired,
  schoolEducationBoardsMaxLength,
  schoolAffiliateNumberMinLength,
  schoolAffiliateNumberMaxLength,
  schoolEducationBoardsMinLength,
} = require("@MEHelpers/validationMessage");

const { getISTDateTime } = require("@MEUtils/utility");

const { Schema } = mongoose;

const schoolSchema = Schema(
  {
    affiliate_number: {
      type: String,
      trim: true,
      index: true,
      unique: true,
      required: [true, schoolAffiliateNumberRequired],
      maxlength: [schoolAffiliateNumberMaxChar, schoolAffiliateNumberMaxLength],
      minlength: [schoolAffiliateNumberMinChar, schoolAffiliateNumberMinLength],
    },
    organization: {
      type: Schema.Types.ObjectId,
      required: [true, organizationNameRequired],
      ref: "organization",
    },
    name: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, schoolNameRequired],
      maxlength: [schoolNameMaxChar, schoolNameMaxLength],
      minlength: [schoolNameMinChar, schoolNameMinLength],
    },
    short_name: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, schoolShortNameRequired],
      maxlength: [schoolShortNameMaxChar, schoolShortNameMaxLength],
      minlength: [schoolShortNameMinChar, schoolShortNameMinLength],
    },
    email: {
      type: String,
      trim: true,
      required: [true, emailRequired],
      maxlength: [emailMaxChar, emailMaxLength],
      minlength: [emailMinChar, emailMinLength],
      match: [emailRegex, emailInvalid],
    },
    phone_number: {
      type: String,
      trim: true,
      required: [true, phoneNumberRequired],
      maxlength: [phoneNumberChar, phoneNumberMaxLength],
      minlength: [phoneNumberChar, phoneNumberMinLength],
      match: [phoneRegex, phoneNumberInvalid],
    },
    established_year: {
      type: Number,
      required: [true, schoolEstablishedYearRequired],
      min: [schoolEstablishedYearMinNumber, schoolEstablishedYearMinYear],
      max: [moment().year(), schoolEstablishedYearMaxYear],
    },
    school_type: {
      type: Schema.Types.ObjectId,
      required: [true, schoolTypeIdRequired],
      ref: "school_type",
      validate: {
        validator: isActiveSchoolTypeExistsValidator,
        message: schoolTypeIdInvalid,
      },
    },
    education_boards: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "education_board",
          validate: {
            validator: isActiveEducationBoardExistsValidator,
            message: educationBoardIdInvalid,
          },
        },
      ],
      required: [true, schoolEducationBoardsRequired],
      validate: [
        {
          validator: function (val) {
            return Array.isArray(val) && val.length >= 1;
          },
          message: schoolEducationBoardsMinLength,
        },
        {
          validator: function (val) {
            return (
              Array.isArray(val) && val.length <= schoolEducationBoardsMaxLimit
            );
          },
          message: schoolEducationBoardsMaxLength,
        },
      ],
    },
    logo: {
      type: String,
      trim: true,
      maxlength: [schoolLogoMaxChar, schoolLogoMaxLength],
      minlength: [schoolLogoMinChar, schoolLogoMinLength],
    },
    website: {
      type: String,
      trim: true,
      match: [websiteURLRegex, schoolWebsiteURL],
    },
    youtube: {
      type: String,
      trim: true,
      match: [youtubeURLRegex, youtubeURLPattern],
    },
    facebook: {
      type: String,
      trim: true,
      match: [facebookURLRegex, facebookURLPattern],
    },
    instagram: {
      type: String,
      trim: true,
      match: [instagramURLRegex, instagramURLPattern],
    },
    twitter: {
      type: String,
      trim: true,
      match: [twitterURLRegex, twitterURLPattern],
    },
    about:{
      type: String,
      trim: true,
      maxlength: [schoolAboutMaxChar, schoolAboutMaxLength],
      minlength: [schoolAboutMinChar, schoolAboutMinLength],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      required: [true, usernameRequired],
      ref: "user",
      validate: {
        validator: isActiveUserValidator,
        message: usernameInvalid,
      },
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      required: [true, usernameRequired],
      ref: "user",
      validate: {
        validator: isActiveUserValidator,
        message: usernameInvalid,
      },
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

schoolSchema.virtual("school_address_count", {
  ref: "school_address",
  localField: "_id",
  foreignField: "school",
  count: true,
  options: { match: { is_active: true } },
});

schoolSchema.virtual("school_address", {
  ref: "school_address",
  localField: "_id",
  foreignField: "school",
});

schoolSchema.virtual("school_academic_class", {
  ref: "school_academic_class",
  localField: "_id",
  foreignField: "school",
  options: { match: { is_active: true } },
});

schoolSchema.virtual("school_facility", {
  ref: "school_facility",
  localField: "_id",
  foreignField: "school",
  options: { match: { is_active: true } },
});

schoolSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, response) {
    if (response?.created_by?.username) {
      response.created_by = response.created_by.username;
    } else {
      delete response.created_by;
    }

    if (response?.updated_by?.username) {
      response.updated_by = response.updated_by.username;
    } else {
      delete response.updated_by;
    }

    if (response?.created_at) {
      response.created_at = getISTDateTime(response.created_at);
    }

    if (response?.updated_at) {
      response.updated_at = getISTDateTime(response.updated_at);
    }

    return response;
  },
});
schoolSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("school", schoolSchema);
