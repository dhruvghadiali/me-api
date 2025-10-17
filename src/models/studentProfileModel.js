const mongoose = require("mongoose");
const { Schema } = mongoose;

const { isActiveUserValidator } = require("@MEUtils/dbQuery");

const { aadhaarNumberChar } = require("@MEHelpers/validationConst");

const {
  usernameInvalid,
  usernameRequired,
  aadhaarNumberMaxLength,
  aadhaarNumberMinLength,
} = require("@MEHelpers/validationMessage");

const { GENDERS, BLOOD_GROUPS } = require("@ME/helpers/enums/studentEnums");

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
      enum: Object.values(GENDERS),
    },
    blood_group: {
      type: String,
      trim: true,
      uppercase: true,
      enum: Object.values(BLOOD_GROUPS),
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

    // Parents (references to Parent model)
    father: {
      type: Schema.Types.ObjectId,
      ref: "parent_profile",
      required: true,
    },
    mother: {
      type: Schema.Types.ObjectId,
      ref: "parent_profile",
      required: true,
    },

    // Siblings - references to SiblingProfile model
    siblings: {
      type: [Schema.Types.ObjectId],
      ref: "sibling_profile",
      default: [],
    },

    // Emergency contacts (recommend up to two) - references to EmergencyContact model
    emergency_contacts: {
      type: [Schema.Types.ObjectId],
      ref: "emergency_contact",
      default: [],
    },

    // Medical information
    medical_info: {
      // Hearing
      has_hearing_issue: { type: Boolean, default: false },
      hearing_issue_details: {
        type: String,
        trim: true,
        validate: {
          validator: function (val) {
            if (!this || !this.has_hearing_issue) return true;
            return typeof val === "string" && val.trim().length > 0;
          },
          message:
            "hearing_issue_details is required when has_hearing_issue is true",
        },
      },

      // Vision
      has_vision_issue: { type: Boolean, default: false },
      vision_issue_details: {
        type: String,
        trim: true,
        validate: {
          validator: function (val) {
            if (!this || !this.has_vision_issue) return true;
            return typeof val === "string" && val.trim().length > 0;
          },
          message:
            "vision_issue_details is required when has_vision_issue is true",
        },
      },

      // Physical
      has_physical_issue: { type: Boolean, default: false },
      physical_issue_details: {
        type: String,
        trim: true,
        validate: {
          validator: function (val) {
            if (!this || !this.has_physical_issue) return true;
            return typeof val === "string" && val.trim().length > 0;
          },
          message:
            "physical_issue_details is required when has_physical_issue is true",
        },
      },

      // Mental
      has_mental_issue: { type: Boolean, default: false },
      mental_issue_details: {
        type: String,
        trim: true,
        validate: {
          validator: function (val) {
            if (!this || !this.has_mental_issue) return true;
            return typeof val === "string" && val.trim().length > 0;
          },
          message:
            "mental_issue_details is required when has_mental_issue is true",
        },
      },

      // Allergies
      has_allergies: { type: Boolean, default: false },
      allergies: {
        type: [String],
        default: [],
        validate: {
          validator: function (arr) {
            if (!this || !this.has_allergies) return true;
            return Array.isArray(arr) && arr.length > 0;
          },
          message:
            "At least one allergy is required when has_allergies is true",
        },
      },
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
