--
-- Name: users; Type: TABLE; Schema: public; Owner: -; Tablespace:
--

CREATE TABLE users (
  userid serial PRIMARY KEY,
  username text NOT NULL UNIQUE CHECK (length(username) >= 3 AND length(username) <= 15),
  first_name text NOT NULL,
  last_name text NOT NULL,
  password text NOT NULL,
  is_admin boolean NOT NULL DEFAULT false,
  date_created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);
