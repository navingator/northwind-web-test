
-- Create a sequence to generate product category IDs
CREATE SEQUENCE categories_id_seq START WITH 100;

ALTER TABLE categories ALTER COLUMN categoryid SET DEFAULT nextval('categories_id_seq'::regclass);
ALTER TABLE categories ADD UNIQUE (categoryname);
