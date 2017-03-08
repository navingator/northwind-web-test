#!/bin/bash
# Adapted from https://github.com/pthom/northwind_psql

DIR="$(dirname $(readlink -f $0))"

NORTHWIND_DIR="$DIR/northwind_psql/northwind.sql"
USER_DIR="$DIR/extensions/users.sql"
PRODUCTS_DIR="$DIR/extensions/products.sql"

dropdb northwind
createdb northwind

psql northwind < $NORTHWIND_DIR
psql northwind < $USER_DIR
psql northwind < $PRODUCTS_DIR

# Create a role northwind_user before this part
psql template1 -c "GRANT ALL ON DATABASE northwind TO northwind_user;"
psql northwind -c "GRANT ALL ON ALL TABLES IN SCHEMA public TO northwind_user;"
psql northwind -c "GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO northwind_user;"
