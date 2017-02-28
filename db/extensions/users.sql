--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET default_tablespace = '';

SET default_with_oids = false;


-- Drop table if it exists
DROP TABLE IF EXISTS users;

--
-- Name: users; Type: TABLE; Schema: public; Owner: -; Tablespace:
--

CREATE TABLE users (
  id serial PRIMARY KEY,
  username character varying(15) NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  password text NOT NULL,
  date_updated timestamp NOT NULL default CURRENT_TIMESTAMP,
  security text,
  last_login timestamp
);
