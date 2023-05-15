"use strict";

/** User of the site. */

const { NotFoundError, UnauthorizedError } = require("../expressError");
const db = require("../db");
const SECRET_KEY = require("../config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class User {
  /** Register new user. Returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({ username, password, first_name, last_name, phone }) {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users (username,
                          password,
                          first_name,
                          last_name, phone, join_at)
        VALUES
          ($1, $2, $3, $4, $5, current_timestamp)
        RETURNING username, password, first_name, last_name, phone`,
      [username, hashedPassword, first_name, last_name, phone]
    );

    return result.rows[0];
  }

  /** Authenticate: is username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    const result = await db.query(
      "SELECT password FROM users WHERE username = $1",
      [username]
    );
    const user = result.rows[0];

    if (user) {
      if ((await bcrypt.compare(password, user.password)) === true) {
        const token = jwt.sign({ username }, SECRET_KEY);
        return res.json({ token });
      }
    }
    throw new UnauthorizedError("Invalid user/password");
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    const result = await db.query(
      `UPDATE users
       SET last_login_at = current_timestamp
         WHERE username = $1
         RETURNING username, last_login_at`,
      [username]
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No such user: ${username}`);

    return user;
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name}, ...] */

  static async all() {
    const result = await db.query(
      `SELECT username,
       first_name,
       last_name
       FROM users
       ORDER BY username`
    )
    return result.rows;
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    const result = await db.query(
      `SELECT username,
       first_name,
       last_name,
       phone,
       join_at,
       last_login_at
       FROM users
       WHERE username = $1
       `,[username]
    )
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No such username: ${username}`);

    return user;
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {

    const result = await db.query(
          `SELECT m.id,
          m.to_username,
          m.body,
          m.sent_at,
          m.read_at,
          t.username,
          t.first_name AS to_first_name,
          t.last_name AS to_last_name,
          t.phone AS to_phone,
    FROM messages AS m
      JOIN users AS f ON m.from_username = f.username
      JOIN users AS t ON m.to_username = t.username
    WHERE f.username = $1`,[username]
    );
    let messages = result.rows;

    if (!messages) throw new NotFoundError(`No message found for: ${username}`);

    return result.map(m => ({
      id: m.id,
      to_user: {
        username: m.username,
        first_name: m.to_first_name,
        last_name: m.to_last_name,
        phone: m.to_phone,
      },
      body: m.body,
      sent_at: m.sent_at,
      read_at: m.read_at,
    }));
  }
}


  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) {}
}

module.exports = User;
