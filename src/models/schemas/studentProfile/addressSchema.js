const mongoose = require("mongoose");

const {
  isActiveCityExistsValidator,
  isActiveStateExistsValidator,
  isActiveZipcodeExistsValidator,
  isActiveDistrictExistsValidator,
  isActiveAreaNameExistsValidator,
} = require("@MEUtils/dbQuery");

const {
  addressMaxChar,
  addressMinChar,
} = require("@MEHelpers/validationConst");

const {
  zipcodeInvalid,
  zipcodeRequired,
  cityNameInvalid,
  addressRequired,
  areaNameInvalid,
  stateNameInvalid,
  addressMaxLength,
  cityNameRequired,
  addressMinLength,
  areaNameRequired,
  stateNameRequired,
  districtNameInvalid,
  districtNameRequired,
} = require("@MEHelpers/validationMessage");

const { Schema } = mongoose;

const addressSchema = new Schema(
  {
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
      validate: { validator: isActiveStateExistsValidator, message: stateNameInvalid },
    },
    district: {
      type: Schema.Types.ObjectId,
      required: [true, districtNameRequired],
      ref: "district",
      validate: { validator: isActiveDistrictExistsValidator, message: districtNameInvalid },
    },
    city: {
      type: Schema.Types.ObjectId,
      required: [true, cityNameRequired],
      ref: "city",
      validate: { validator: isActiveCityExistsValidator, message: cityNameInvalid },
    },
    area_name: {
      type: Schema.Types.ObjectId,
      required: [true, areaNameRequired],
      ref: "area_name",
      validate: { validator: isActiveAreaNameExistsValidator, message: areaNameInvalid },
    },
    zipcode: {
      type: Schema.Types.ObjectId,
      required: [true, zipcodeRequired],
      ref: "zipcode",
      validate: { validator: isActiveZipcodeExistsValidator, message: zipcodeInvalid },
    },
  },
  { _id: false }
);

module.exports = addressSchema;
