"use strict";

const Router = require("express").Router;
const User = require("../models/user");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");

const router = new Router();

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name}, ...]}
 *
 **/
router.get("/", ensureLoggedIn, async function (req, res, next) {
  const users = await User.all();
  return res.json({ users });
});

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
router.get("/:username", ensureCorrectUser, async function (req, res, next) {
  const userDetail = await User.get(req.params.username);
  return res.json({ userDetail });
});

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/to", ensureCorrectUser, async function (req, res, next) {
  const messagesTo = await User.messagesTo(req.params.username);
  return res.json({ messagesTo });
});

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get(
  "/:username/from",
  ensureCorrectUser,
  async function (req, res, next) {
    const messagesFrom = await User.messagesFrom(req.params.username);
    return res.json({ messagesFrom });
  }
);

module.exports = router;
