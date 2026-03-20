const {
  addOrganizationMember,
} = require("@MEControllers/organizationMemberController/addOrganizationMemberController");
const {
  deleteOrganizationMember,
} = require("@MEControllers/organizationMemberController/deleteOrganizationMemberController");
const {
  updateOrganizationMember,
} = require("@MEControllers/organizationMemberController/updateOrganizationMemberController");

module.exports = {
  addOrganizationMember,
  deleteOrganizationMember,
  updateOrganizationMember,
};
