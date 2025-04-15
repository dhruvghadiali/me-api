const User = require("@MEModels/userModel");
const City = require("@MEModels/cityModel");
const State = require("@MEModels/stateModel");
const Zipcode = require("@MEModels/zipcodeModel");
const District = require("@MEModels/districtModel");
const AreaName = require("@MEModels/areaNameModel");
const validationMessage = require("@MEHelpers/validationMessage");

exports.isActiveUserValidator = {
  validator: async function (value) {
    const user = await User.findById(value);
    return !!(user && user.is_active);
  },
  message: validationMessage.usernameInvalid,
};

exports.isStateExistsValidator = {
  validator: async function (value) {
    const stateExists = await State.findById(value);
    return !!stateExists;
  },
  message: validationMessage.stateNameInvalid,
};

exports.isDistrictExistsValidator = {
  validator: async function (value) {
    const districtExists = await District.findById(value);
    return !!districtExists;
  },
  message: validationMessage.districtNameInvalid,
};

exports.isCityExistsValidator = {
  validator: async function (value) {
    const cityExists = await City.findById(value);
    return !!cityExists;
  },
  message: validationMessage.cityNameInvalid,
};

exports.isAreaNameExistsValidator = {
  validator: async function (value) {
    const areaNameExists = await AreaName.findById(value);
    return !!areaNameExists;
  },
  message: validationMessage.areaNameInvalid,
};

exports.isZipcodeExistsValidator = {
  validator: async function (value) {
    const zipcodeExists = await Zipcode.findById(value);
    return !!zipcodeExists;
  },
  message: validationMessage.invalidZipcode,
};
