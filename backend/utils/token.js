const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JSON_WEB_T, { expiresIn: '1d' });
};
  
module.exports = generateToken;