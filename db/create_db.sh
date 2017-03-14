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
psql $DB < $EXTENSION_DIR/users.sql
psql $DB < $EXTENSION_DIR/categories.sql
psql $DB < $EXTENSION_DIR/products.sql
psql $DB < $EXTENSION_DIR/drop_excess_tables.sql #must be last

# Add errors
$DIR/scripts/errors_refresh.sh $DB

# Create a role northwind_user before this part
psql template1 -c "GRANT ALL ON DATABASE $DB TO northwind_user;"
psql $DB -c "GRANT ALL ON ALL TABLES IN SCHEMA public TO northwind_user;"
psql $DB -c "GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO northwind_user;"
