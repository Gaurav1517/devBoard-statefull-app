require("dotenv").config();

module.exports = {
  APP_PORT: process.env.APP_PORT,

  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,

  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,

  SESSION_SECRET: process.env.SESSION_SECRET,

  FRONTEND_URL: process.env.FRONTEND_URL
};