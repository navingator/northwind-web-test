--
-- Name: users; Type: TABLE; Schema: public; Owner: -; Tablespace:
--

CREATE TABLE users (
  id serial PRIMARY KEY,
  username character varying(15) NOT NULL UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  password text NOT NULL,
  date_updated timestamp NOT NULL default CURRENT_TIMESTAMP,
  security text,
  last_login timestamp
);
