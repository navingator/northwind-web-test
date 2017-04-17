#!/bin/bash
# Adapted from https://github.com/pthom/northwind_psql

# Gets the base directory for this file and it's operations
DIR="$(dirname $(readlink -f $0))"
DB="${1:-northwind}"

NORTHWIND_DIR="$DIR/northwind_psql"
EXTENSION_DIR="$DIR/extensions"

dropdb $DB
createdb $DB

# Create database from dump
psql $DB < $NORTHWIND_DIR/northwind.sql

# Extend the database
psql $DB < $EXTENSION_DIR/users.sql # must be before products, which extends a foreign key to users
psql $DB < $EXTENSION_DIR/categories.sql
psql $DB < $EXTENSION_DIR/products.sql
psql $DB < $EXTENSION_DIR/drop_excess_tables.sql #must be after northwind table extensions

psql $DB < $EXTENSION_DIR/session.sql

# Add errors
bash $DIR/scripts/errors_refresh.sh $DB

# Create a role northwind_user before this part
psql template1 -c "GRANT ALL ON DATABASE $DB TO northwind_user;"
psql $DB -c "GRANT ALL ON ALL TABLES IN SCHEMA public TO northwind_user;"
psql $DB -c "GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO northwind_user;"
