#!/bin/bash
# Adapted from https://github.com/pthom/northwind_psql

DIR="$(dirname $(readlink -f $0))"

NORTHWIND_DIR="$DIR/northwind_psql/northwind.sql"
USER_DIR="$DIR/extensions/users.sql"
CATEGORIES_DIR="$DIR/extensions/categories.sql"

dropdb northwind
dropuser northwind_user

createdb northwind
psql northwind < $NORTHWIND_DIR
psql northwind < $USER_DIR
psql northwind < $CATEGORIES_DIR

psql template1 -c "CREATE USER northwind_user;"
psql template1 -c "GRANT ALL ON DATABASE northwind TO northwind_user;"
psql northwind -c "GRANT ALL ON ALL tables IN SCHEMA public TO northwind_user"
