--
-- Name: users; Type: TABLE; Schema: public; Owner: -; Tablespace:
--

CREATE TABLE users (
  userid serial PRIMARY KEY,
  username text NOT NULL UNIQUE CHECK (length(username) >= 3 AND length(username) <= 15),
  first_name text NOT NULL,
  last_name text NOT NULL,
  password text NOT NULL,
  date_updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  security text,
  last_login timestamp
);
