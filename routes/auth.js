"use strict";

const Router = require("express").Router;
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { SECRET_KEY } = require("../config");
const { BadRequestError, UnauthorizedError } = require("../expressError");

const router = new Router();


/** POST /login: {username, password} => {token} */
router.post("/login", async function (req, res, next) {
  if (req.body === undefined) throw new BadRequestError();

  const { username, password } = req.body;

  if (await User.authenticate(username, password)) {
    const token = jwt.sign({ username }, SECRET_KEY);
    // TODO: update login timestamp
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
  const { username } = await User.register(data);
  const token = jwt.sign({ username }, SECRET_KEY);
  
  return res.json({ token });
});

module.exports = router;
