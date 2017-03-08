
-- Create a sequence to generate product IDs
CREATE SEQUENCE products_id_seq START WITH 100;

ALTER TABLE products ALTER COLUMN productid SET DEFAULT nextval('products_id_seq'::regclass);
ALTER TABLE products ALTER COLUMN categoryid SET NOT NULL;
