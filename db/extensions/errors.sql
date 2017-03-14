-- Error table for storing server errors - currently ONLY database errors
DROP TABLE IF EXISTS errors;
CREATE TABLE errors (
  errorid int PRIMARY KEY,
  message text NOT NULL,
  db_error_code int NOT NULL,
  db_table text,
  db_col text,
  db_constraint text
)
