
-- Create a sequence to generate product IDs
CREATE SEQUENCE products_id_seq START WITH 100;

ALTER TABLE products ALTER COLUMN productid SET DEFAULT nextval('products_id_seq'::regclass);
ALTER TABLE products ADD UNIQUE (productname);
ALTER TABLE products ALTER COLUMN categoryid SET NOT NULL;
ALTER TABLE products ALTER COLUMN discontinued TYPE bool USING CASE WHEN discontinued=0 THEN FALSE ELSE TRUE END;
