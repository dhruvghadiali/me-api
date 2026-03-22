const moment = require("moment");
const mongoose = require("mongoose");

const {
  isActiveUserValidator,
  isActiveCityExistsValidator,
  isActiveStateExistsValidator,
  isActiveSchoolExistsValidator,
  isActiveZipcodeExistsValidator,
  isActiveDistrictExistsValidator,
  isActiveAreaNameExistsValidator,
} = require("@MEUtils/dbQuery");
const {
  zipcodeInvalid,
  usernameInvalid,
  zipcodeRequired,
  cityNameInvalid,
  addressRequired,
  areaNameInvalid,
  areaNameRequired,
  stateNameInvalid,
  addressMaxLength,
  cityNameRequired,
  addressMinLength,
  usernameRequired,
  stateNameRequired,
  schoolNameRequired,
  districtNameInvalid,
  districtNameRequired,
  latitudeInvalidFormate,
  latitudeMinLength,
  latitudeMaxLength,
  longitudeInvalidFormate,
  longitudeMinLength,
  longitudeMaxLength,
  campusAreaInvalidFormate,
  campusAreaMinLength,
  campusAreaMaxLength,
  buildingAreaInvalidFormate,
  buildingAreaMinLength,
  buildingAreaMaxLength,
  outdoorAreaInvalidFormate,
  outdoorAreaMinLength,
  outdoorAreaMaxLength,
  schoolHoursOpenTimeInvalid,
  schoolHoursCloseTimeInvalid,
  administrativeHoursOpenTimeInvalid,
  administrativeHoursCloseTimeInvalid,
} = require("@MEHelpers/validationMessage");
const {
  addressMaxChar,
  addressMinChar,
  latitudeMin,
  latitudeMax,
  longitudeMin,
  longitudeMax,
  campusAreaMin,
  campusAreaMax,
  buildingAreaMin,
  buildingAreaMax,
  outdoorAreaMin,
  outdoorAreaMax,
} = require("@MEHelpers/validationConst");

const { timeRegex } = require("@MEHelpers/regex");

const { getISTDateTime } = require("@MEUtils/utility");

const { Schema } = mongoose;

let schoolAddressTransformMode = "default";

const dayTimeSchema = new Schema(
  {
    open_time: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => v === "" || timeRegex.test(v),
        message: schoolHoursOpenTimeInvalid,
      },
    },
    close_time: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => v === "" || timeRegex.test(v),
        message: schoolHoursCloseTimeInvalid,
      },
    },
    closed:{
      type: Boolean,
      default: false
    }
  },
  { _id: false }
);

const adminDayTimeSchema = new Schema(
  {
    open_time: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => v === "" || timeRegex.test(v),
        message: administrativeHoursOpenTimeInvalid,
      },
    },
    close_time: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => v === "" || timeRegex.test(v),
        message: administrativeHoursCloseTimeInvalid,
      },
    },
    closed:{
      type: Boolean,
      default: false
    }
  },
  { _id: false }
);

const schoolAddressSchema = Schema(
  {
    school: {
      type: Schema.Types.ObjectId,
      required: [true, schoolNameRequired],
      ref: "school",
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, usernameRequired],
      ref: "user",
    },
    address: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, addressRequired],
      maxlength: [addressMaxChar, addressMaxLength],
      minlength: [addressMinChar, addressMinLength],
    },
    state: {
      type: Schema.Types.ObjectId,
      required: [true, stateNameRequired],
      ref: "state",
      validate: {
        validator: isActiveStateExistsValidator,
        message: stateNameInvalid,
      },
    },
    district: {
      type: Schema.Types.ObjectId,
      required: [true, districtNameRequired],
      ref: "district",
      validate: {
        validator: isActiveDistrictExistsValidator,
        message: districtNameInvalid,
      },
    },
    city: {
      type: Schema.Types.ObjectId,
      required: [true, cityNameRequired],
      ref: "city",
      validate: {
        validator: isActiveCityExistsValidator,
        message: cityNameInvalid,
      },
    },
    area_name: {
      type: Schema.Types.ObjectId,
      required: [true, areaNameRequired],
      ref: "area_name",
      validate: {
        validator: isActiveAreaNameExistsValidator,
        message: areaNameInvalid,
      },
    },
    zipcode: {
      type: Schema.Types.ObjectId,
      required: [true, zipcodeRequired],
      ref: "zipcode",
      validate: {
        validator: isActiveZipcodeExistsValidator,
        message: zipcodeInvalid,
      },
    },
    latitude: {
      type: Number,
      min: [latitudeMin, latitudeMinLength],
      max: [latitudeMax, latitudeMaxLength],
      validate: {
        validator: (v) => typeof v === "number",
        message: latitudeInvalidFormate,
      },
    },
    longitude: {
      type: Number,
      min: [longitudeMin, longitudeMinLength],
      max: [longitudeMax, longitudeMaxLength],
      validate: {
        validator: (v) => typeof v === "number",
        message: longitudeInvalidFormate,
      },
    },
    campus_area: {
      type: Number,
      min: [campusAreaMin, campusAreaMinLength],
      max: [campusAreaMax, campusAreaMaxLength],
      validate: {
        validator: (v) => typeof v === "number",
        message: campusAreaInvalidFormate,
      },
    },
    building_area: {
      type: Number,
      min: [buildingAreaMin, buildingAreaMinLength],
      max: [buildingAreaMax, buildingAreaMaxLength],
      validate: {
        validator: (v) => typeof v === "number",
        message: buildingAreaInvalidFormate,
      },
    },
    outdoor_area: {
      type: Number,
      min: [outdoorAreaMin, outdoorAreaMinLength],
      max: [outdoorAreaMax, outdoorAreaMaxLength],
      validate: {
        validator: (v) => typeof v === "number",
        message: outdoorAreaInvalidFormate,
      },
    },
    school_hours: {
      monday: dayTimeSchema,
      tuesday: dayTimeSchema,
      wednesday: dayTimeSchema,
      thursday: dayTimeSchema,
      friday: dayTimeSchema,
      saturday: dayTimeSchema,
      sunday: dayTimeSchema,
    },
    administrative_hours: {
      monday: adminDayTimeSchema,
      tuesday: adminDayTimeSchema,
      wednesday: adminDayTimeSchema,
      thursday: adminDayTimeSchema,
      friday: adminDayTimeSchema,
      saturday: adminDayTimeSchema,
      sunday: adminDayTimeSchema,
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

schoolAddressSchema.index(
  { school: 1, user: 1 },
  { unique: true, index: true }
);

schoolAddressSchema.statics.setSchoolAddressTransformMode = function (mode) {
  schoolAddressTransformMode = mode;
};

schoolAddressSchema.set("toJSON", {
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

    if (response?.user?.id) {
      response.user_id = response.user.id;
    }

    if (response?.created_at) {
      response.created_at = getISTDateTime(response.created_at);
    }

    if (response?.updated_at) {
      response.updated_at = getISTDateTime(response.updated_at);
    }

    if (schoolAddressTransformMode === "summary") {
      if (response?.state?.name) {
        response.state = response.state.name;
      }

      if (response?.district?.name) {
        response.district = response.district.name;
      }

      if (response?.city?.name) {
        response.city = response.city.name;
      }

      if (response?.area_name?.name) {
        response.area_name = response.area_name.name;
      }

      if (response?.zipcode?.zipcode) {
        response.zipcode = response.zipcode.zipcode;
      }
    }

    return response;
  },
});
schoolAddressSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("school_address", schoolAddressSchema);
