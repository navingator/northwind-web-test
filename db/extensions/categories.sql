
-- Create a sequence to generate product category IDs
CREATE SEQUENCE categories_id_seq START WITH 100;

ALTER TABLE categories ALTER COLUMN categoryid SET DEFAULT nextval('categories_id_seq'::regclass);
ALTER TABLE categories ADD UNIQUE (categoryname);
ALTER TABLE categories ALTER COLUMN categoryname TYPE text;
ALTER TABLE categories ADD CONSTRAINT categories_categoryname_check CHECK (length(categoryname) > 0 AND length(categoryname) <= 15);
