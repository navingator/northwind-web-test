--
-- Name: users; Type: TABLE; Schema: public; Owner: -; Tablespace:
--

CREATE TABLE users (
  id serial PRIMARY KEY,
  username text CHECK (length(username) > 0 AND length(username) <= 15) NOT NULL UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  password text NOT NULL,
  date_updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  security text,
  last_login timestamp
);
