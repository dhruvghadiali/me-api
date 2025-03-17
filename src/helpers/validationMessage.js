const validationMessage = {
  firstNameRequired: "First name is required",
  firstNameMaxLength: "First name must be less then 25 characters",
  firstNameMinLength: "First name must be greater then 5 characters",
  lastNameRequired: "Last name is required",
  lastNameMaxLength: "Last name must be less then 25 characters",
  lastNameMinLength: "Last name must be greater then 5 characters",
  emailRequired: "Email is required",
  emailMaxLength: "Email must be less then 100 characters",
  emailMinLength: "Email must be greater then 5 characters",
  emailInvalid: "Invalid email formate",
  phoneNumberRequired: "Phone number is required",
  phoneNumberMaxLength: "Phone number must be 10 characters",
  phoneNumberMinLength: "Phone number must be 10 characters",
  phoneNumberInvalid: "Invalid phone number formate",
  usernameRequired: "Username is required",
  usernameMaxLength: "Username must be less then 200 characters",
  usernameMinLength: "Username must be greater then 5 characters",
  passwordRequired: "Password is required",
  passwordMaxLength: "Password must be less then 200 characters",
  passwordMinLength: "Password must be greater then 5 characters",
};

module.exports = validationMessage;
