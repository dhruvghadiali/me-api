const User = require("@MEModels/userModel");
const City = require("@MEModels/cityModel");
const State = require("@MEModels/stateModel");
const Zipcode = require("@MEModels/zipcodeModel");
const AreaName = require("@MEModels/areaNameModel");
const District = require("@MEModels/districtModel");

const isActiveUserValidator = async (value) => {
  const user = await User.findById(value);
  return !!(user && user.is_active);
};

const isActiveStateExistsValidator = async (value) => {
  const stateExists = await State.findById(value);
  return !!(stateExists && stateExists.is_active);
};

const isActiveDistrictExistsValidator = async (value) => {
  const districtExists = await District.findById(value);
  return !!(districtExists && districtExists.is_active);
};

const isActiveCityExistsValidator = async (value) => {
  const cityExists = await City.findById(value);
  return !!(cityExists && cityExists.is_active);
};

const isActiveAreaNameExistsValidator = async (value) => {
  const areaNameExists = await AreaName.findById(value);
  return !!(areaNameExists && areaNameExists.is_active);
};

const isActiveZipcodeExistsValidator = async (value) => {
  const zipcodeExists = await Zipcode.findById(value);
  return !!(zipcodeExists && zipcodeExists.is_active);
};

module.exports = {
  isActiveUserValidator,
  isActiveCityExistsValidator,
  isActiveStateExistsValidator,
  isActiveZipcodeExistsValidator,
  isActiveDistrictExistsValidator,
  isActiveAreaNameExistsValidator,
};
