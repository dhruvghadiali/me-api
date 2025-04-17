// const moment = require("moment");
// const mongoose = require("mongoose");

// const validationMessage = require("@MEHelpers/validationMessage");
// const validationConst = require("@MEHelpers/validationConst");
// const regex = require("@MEHelpers/regex");
// const {
//   isActiveUserValidator,
//   isStateExistsValidator,
//   isDistrictExistsValidator,
//   isCityExistsValidator,
//   isAreaNameExistsValidator,
//   isZipcodeExistsValidator,
//   isOrganizationExistsValidator,
// } = require("@MEHelpers/modelValidator");

// const { Schema } = mongoose;

// const organizationMemberSchema = Schema(
//   {
//     organization: {
//       type: Schema.Types.ObjectId,
//       index: true,
//       unique: true,
//       required: [true, validationMessage.organizationDetailsRequired],
//       ref: "state",
//       validate: isOrganizationExistsValidator,
//     },
//     first_name: {
//       type: String,
//       trim: true,
//       required: [true, validationMessage.firstNameRequired],
//       maxlength: [
//         validationConst.firstNameMaxLength,
//         validationMessage.firstNameMaxLength,
//       ],
//       minlength: [
//         validationConst.firstNameMinLength,
//         validationMessage.firstNameMinLength,
//       ],
//     },
//     last_name: {
//       type: String,
//       trim: true,
//       required: [true, validationMessage.lastNameRequired],
//       maxlength: [
//         validationConst.lastNameMaxLength,
//         validationMessage.lastNameMaxLength,
//       ],
//       minlength: [
//         validationConst.lastNameMinLength,
//         validationMessage.lastNameMinLength,
//       ],
//     },
//     email: {
//       type: String,
//       trim: true,
//       required: [true, validationMessage.emailRequired],
//       maxlength: [
//         validationConst.emailMaxLength,
//         validationMessage.emailMaxLength,
//       ],
//       minlength: [
//         validationConst.emailMinLength,
//         validationMessage.emailMinLength,
//       ],
//       match: [regex.emailRegex, validationMessage.emailInvalid],
//     },
//     phone_number: {
//       type: String,
//       trim: true,
//       required: [true, validationMessage.phoneNumberRequired],
//       maxlength: [
//         validationConst.phoneNumberLength,
//         validationMessage.phoneNumberMaxLength,
//       ],
//       minlength: [
//         validationConst.phoneNumberLength,
//         validationMessage.phoneNumberMinLength,
//       ],
//       match: [regex.phoneRegex, validationMessage.phoneNumberInvalid],
//     },
//     position: {
//       type: String,
//       trim: true,
//       lowercase: true,
//       required: [true, validationMessage.organizationMemberPositionRequired],
//       maxlength: [
//         validationConst.organizationMemberPositionMaxLength,
//         validationMessage.organizationMemberPositionMaxLength,
//       ],
//       minlength: [
//         validationConst.organizationMemberPositionMinLength,
//         validationMessage.organizationMemberPositionMinLength,
//       ],
//     },
//     aadhaar_number: {
//       type: String,
//       trim: true,
//       lowercase: true,
//       required: [true, validationMessage.aadhaarNumberRequired],
//       maxlength: [
//         validationConst.aadhaarNumberLength,
//         validationMessage.aadhaarNumberMaxLength,
//       ],
//       minlength: [
//         validationConst.aadhaarNumberLength,
//         validationMessage.aadhaarNumberMinLength,
//       ],
//     },
//     address: {
//       type: String,
//       trim: true,
//       lowercase: true,
//       required: [true, validationMessage.addressRequired],
//       maxlength: [
//         validationConst.addressMaxLength,
//         validationMessage.addressMaxLength,
//       ],
//       minlength: [
//         validationConst.addressMinLength,
//         validationMessage.addressMinLength,
//       ],
//     },
//     state: {
//       type: Schema.Types.ObjectId,
//       required: [true, validationMessage.stateNameRequired],
//       ref: "state",
//       validate: isStateExistsValidator,
//     },
//     district: {
//       type: Schema.Types.ObjectId,
//       required: [true, validationMessage.districtNameRequired],
//       ref: "district",
//       validate: isDistrictExistsValidator,
//     },
//     city: {
//       type: Schema.Types.ObjectId,
//       required: [true, validationMessage.cityNameRequired],
//       ref: "city",
//       validate: isCityExistsValidator,
//     },
//     area_name: {
//       type: Schema.Types.ObjectId,
//       required: [true, validationMessage.areaNameRequired],
//       ref: "area_name",
//       validate: isAreaNameExistsValidator,
//     },
//     zipcode: {
//       type: Schema.Types.ObjectId,
//       required: [true, validationMessage.zipcodeRequired],
//       ref: "zipcode",
//       validate: isZipcodeExistsValidator,
//     },
//     is_active: {
//       type: Boolean,
//       default: true,
//     },
//     created_by: {
//       type: Schema.Types.ObjectId,
//       required: [true, validationMessage.usernameRequired],
//       ref: "user",
//       validate: isActiveUserValidator,
//     },
//     updated_by: {
//       type: Schema.Types.ObjectId,
//       required: [true, validationMessage.usernameRequired],
//       ref: "user",
//       validate: isActiveUserValidator,
//     },
//   },
//   { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
// );

// organizationMemberSchema.pre("save", async function (next) {
//   let now = moment.utc(moment());

//   this.updated_at = now;
//   this.created_at = now;
//   this.is_active = true;
//   next();
// });

// organizationMemberSchema.set("toJSON", {
//   virtuals: true,
//   transform: function (doc, response) {
//     response.created_by = response?.created_by?.username
//       ? response.created_by.username
//       : null;
//     response.updated_by = response?.updated_by?.username
//       ? response.updated_by.username
//       : null;
//     return response;
//   },
// });
// organizationMemberSchema.set("toObject", { virtuals: true });

// module.exports = mongoose.model(
//   "organization_member",
//   organizationMemberSchema
// );
