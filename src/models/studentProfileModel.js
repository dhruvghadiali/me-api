const mongoose = require("mongoose");
const { Schema } = mongoose;

const { isActiveUserValidator } = require("@MEUtils/dbQuery");
const { phoneRegex } = require("@MEHelpers/regex");

const {
  phoneNumberChar,
  aadhaarNumberChar,
} = require("@MEHelpers/validationConst");

const {
  usernameInvalid,
  usernameRequired,
  phoneNumberInvalid,
  phoneNumberMaxLength,
  phoneNumberMinLength,
  aadhaarNumberMaxLength,
  aadhaarNumberMinLength,
} = require("@MEHelpers/validationMessage");

// Sub-schemas
const parentSchema = require("./schemas/studentProfile/parentSchema");
const siblingSchema = require("./schemas/studentProfile/siblingSchema");
const medicationSchema = require("./schemas/studentProfile/medicationSchema");
const medicalCertificateSchema = require("./schemas/studentProfile/medicalCertificateSchema");
const emergencyContactSchema = require("./schemas/studentProfile/emergencyContactSchema");

const studentProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      unique: true,
      required: [true, usernameRequired],
      validate: {
        validator: isActiveUserValidator,
        message: usernameInvalid,
      },
    },

    // Student core info
    date_of_birth: { type: Date, required: true },
    gender: {
      type: String,
      trim: true,
      lowercase: true,
      enum: ["male", "female", "other"],
    },
    blood_group: {
      type: String,
      trim: true,
      uppercase: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    aadhaar_number: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [aadhaarNumberChar, aadhaarNumberMaxLength],
      minlength: [aadhaarNumberChar, aadhaarNumberMinLength],
    },
    nationality: { type: String, trim: true, lowercase: true },
    photo_url: { type: String, trim: true },

    // Address (student) - reference to Address model
    address: { type: Schema.Types.ObjectId, ref: "address", required: true },

    // Parents
    father: { type: parentSchema, required: true },
    mother: { type: parentSchema, required: true },

    // Siblings
    siblings: { type: [siblingSchema], default: [] },

    // Emergency contacts (recommend up to two)
    emergency_contacts: { type: [emergencyContactSchema], default: [] },

    // Medical information
    medical_info: {
      has_medical_issue: { type: Boolean, required: true, default: false },
      medical_issue_details: {
        type: String,
        trim: true,
        validate: {
          validator: function (val) {
            if (!this.medical_info || !this.medical_info.has_medical_issue) {
              return true;
            }
            return typeof val === "string" && val.trim().length > 0;
          },
          message:
            "Medical issue details are required when has_medical_issue is true",
        },
      },
      allergies: { type: [String], default: [] },
      medications: { type: [medicationSchema], default: [] },
      chronic_conditions: { type: [String], default: [] },
      disability: { type: Boolean, default: false },
      special_needs: { type: String, trim: true },
      primary_physician_name: { type: String, trim: true, lowercase: true },
      primary_physician_phone: {
        type: String,
        trim: true,
        maxlength: [phoneNumberChar, phoneNumberMaxLength],
        minlength: [phoneNumberChar, phoneNumberMinLength],
        match: [phoneRegex, phoneNumberInvalid],
      },
      last_tetanus_shot_at: { type: Date },
      medical_certificates: { type: [medicalCertificateSchema], default: [] },
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

// Unique student profile per user
studentProfileSchema.index({ user: 1 }, { unique: true, index: true });

studentProfileSchema.set("toJSON", {
  virtuals: true,
  transform: function (_, response) {
    if (response?.created_by?.first_name && response?.created_by?.last_name) {
      response.created_by = `${response.created_by.first_name} ${response.created_by.last_name}`;
    } else {
      delete response.created_by;
    }

    if (response?.updated_by?.first_name && response?.updated_by?.last_name) {
      response.updated_by = `${response.updated_by.first_name} ${response.updated_by.last_name}`;
    } else {
      delete response.updated_by;
    }
    return response;
  },
});
studentProfileSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("student_profile", studentProfileSchema);
