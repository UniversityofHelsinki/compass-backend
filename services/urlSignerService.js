const crypto = require('crypto');

const SECRET_KEY = 'your-secret-key'; // Replace with a secure key

const generateSignature = (data) => {
    return crypto.createHmac('sha256', SECRET_KEY).update(data).digest('base64url');
};

const generateSignedUrl = (courseId) => {
    const data = courseId.toString();
    const signature = generateSignature(data);
    return signature;
};

module.exports = {
    generateSignedUrl,
};
