exports.maskEmail = (value) => {
    const [name, domain] = value.split("@");
    if (!domain) return value; 

    const maskedName = name.slice(0, 3) + "*".repeat(name.length - 3);
    const domainParts = domain.split(".");

    if (domainParts.length < 2) return value; 

    const maskedDomain = domainParts[0].slice(0, 3) + "*".repeat(domainParts[0].length - 3);
    const maskedTLD = domainParts[1].slice(0, 2) + "*";

    return `${maskedName}@${maskedDomain}.${maskedTLD}`;
};

exports.maskPhoneNumber = (value) => {
    return value.slice(0, 2) + "*".repeat(value.length - 4) + value.slice(-2);
};

exports.maskUsername = (value) => {
  return value.length > 3 ? value.slice(0, 3) + "*".repeat(value.length - 3) : value[0] + "**";
};
