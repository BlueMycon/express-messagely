"use strict";

const Router = require("express").Router;
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { SECRET_KEY } = require("../config");
const { BadRequestError, UnauthorizedError } = require("../expressError");

const router = new Router();


/** POST /login: {username, password} => {token} */
router.post("/login-1", async function (req, res, next) {
  if (req.body === undefined) throw new BadRequestError();

  const { username, password } = req.body;

  if (User.authenticate(username, password)) {
    const token = jwt.sign({ username }, SECRET_KEY);
    return res.json({ token });
  }

  throw new UnauthorizedError("Invalid user/password");
});

/** POST /register: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */
router.post("/register", async function (req, res, next) {
  if (req.body === undefined) throw new BadRequestError();

  const data = req.body;

  // TODO: validate json data?
  // if (!isValid(data)) {
  //   throw new BadRequestError();
  // }

  const user = User.register(data)

  // TODO: do we want hashed password on user when we sign token?
  const token = jwt.sign({ user }, SECRET_KEY);
  return res.json({ token });
});

module.exports = router;
