\echo 'Delete and recreate messagely db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE messagely;
CREATE DATABASE messagely;
\connect messagely


CREATE TABLE users (
  username TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  join_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_login_at TIMESTAMP WITH TIME ZONE);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  from_username TEXT NOT NULL REFERENCES users,
  to_username TEXT NOT NULL REFERENCES users,
  body TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE);

INSERT INTO users (username, password, first_name, last_name, phone, join_at, last_login_at)
VALUES
('tuckerdiane', '$2b$12$Q1PUFjhN/AWRQ21LbGYvjeLpZZB6lfZ1BPwifHALGO6oIbyC3CmJe', 'tucker', 'diane', '555-555-5555', CURRENT_TIMESTAMP, NULL),
('scottsteven', '$2b$12$Q1PUFjhN/AWRQ21LbGYvjeLpZZB6lfZ1BPwifHALGO6oIbyC3CmJe', 'scott', 'steven', '555-555-5555', CURRENT_TIMESTAMP, NULL),
('tannerjennifer', '$2b$12$Q1PUFjhN/AWRQ21LbGYvjeLpZZB6lfZ1BPwifHALGO6oIbyC3CmJe', 'tanner', 'jennifer', '555-555-5555', CURRENT_TIMESTAMP, NULL),
('arellanoelizabeth', '$2b$12$Q1PUFjhN/AWRQ21LbGYvjeLpZZB6lfZ1BPwifHALGO6oIbyC3CmJe', 'arellano', 'elizabeth', '555-555-5555', CURRENT_TIMESTAMP, NULL);

INSERT INTO messages (from_username, to_username, body, sent_at, read_at)
VALUES
('tuckerdiane', 'scottsteven', 'hey scott, how are you doing?', CURRENT_TIMESTAMP, NULL),
('scottsteven', 'tannerjennifer', 'hey tanner, how are you doing?', CURRENT_TIMESTAMP, NULL),
('tannerjennifer', 'arellanoelizabeth', 'hey arellano, how are you doing?', CURRENT_TIMESTAMP, NULL);


\echo 'Delete and recreate messagely_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE messagely_test;
CREATE DATABASE messagely_test;
\connect messagely_test

CREATE TABLE users (
  username TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  join_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_login_at TIMESTAMP WITH TIME ZONE);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  from_username TEXT NOT NULL REFERENCES users,
  to_username TEXT NOT NULL REFERENCES users,
  body TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE);

