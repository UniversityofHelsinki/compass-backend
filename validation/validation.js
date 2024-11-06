
const validateProperties = async (validations, object) => {
  for (const [property, validation] of Object.entries(validations)) {
    const reason = await Promise.resolve(validation(object[property], object));
    if (reason) {
      return {
        isValid: false,
        reason
      };
    }
  }
};

module.exports = {
  validateProperties
};
