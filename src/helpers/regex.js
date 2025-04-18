const regex = {
  emailRegex: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
  phoneRegex:
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
  youtubeURLRegex:
    /^https?:\/\/(www\.)?(youtube\.com\/(channel|c|user)\/[a-zA-Z0-9_-]+|youtu\.be\/[a-zA-Z0-9_-]+)$/,
  facebookURLRegex: /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9(.?)?]+\/?$/,
  instagramURLRegex: /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9(_)?]+\/?$/,
  zipcode: /^[1-9][0-9]{5}$/,
};

module.exports = regex;
