require('dotenv').config();

module.exports = {
  MONGODBOLD: process.env.MONGODBOLD,
  MONGODB: process.env.MONGODB,
  SECRET_KEY: process.env.SECRET_KEY,
  ACCESS_CODE: process.env.ACCESS_CODE,
  URL: process.env.URL,
};
