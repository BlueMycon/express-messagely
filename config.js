"use strict";

/** Common config for message.ly */

// read .env files and make environmental variables

require("dotenv").config();

const DB_URI = (process.env.NODE_ENV === "test")
    ? "postgresql:///messagely_test"
    : "postgresql:///messagely";

const SECRET_KEY = process.env.SECRET_KEY || "secret";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const FROM_PHONE_NUMBER = process.env.FROM_PHONE_NUMBER;
const TO_PHONE_NUMBER = process.env.TO_PHONE_NUMBER;
const BCRYPT_WORK_FACTOR = 12;


module.exports = {
  DB_URI,
  SECRET_KEY,
  BCRYPT_WORK_FACTOR,
  TWILIO_AUTH_TOKEN,
  FROM_PHONE_NUMBER,
  TO_PHONE_NUMBER
};