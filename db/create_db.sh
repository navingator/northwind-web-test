#!/bin/bash
# Adapted from https://github.com/pthom/northwind_psql

# Gets the base directory for this file and it's operations
DIR="$(dirname $(readlink -f $0))"

NORTHWIND_DIR="$DIR/northwind_psql"
EXTENSION_DIR="$DIR/extensions"

dropdb northwind
createdb northwind

# Create database from dump
psql northwind < $NORTHWIND_DIR/northwind.sql

# Extend the database
psql northwind < $EXTENSION_DIR/users.sql
psql northwind < $EXTENSION_DIR/categories.sql
psql northwind < $EXTENSION_DIR/products.sql
psql northwind < $EXTENSION_DIR/drop_excess_tables.sql #must be last

# Create a role northwind_user before this part
psql template1 -c "GRANT ALL ON DATABASE northwind TO northwind_user;"
psql northwind -c "GRANT ALL ON ALL TABLES IN SCHEMA public TO northwind_user;"
psql northwind -c "GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO northwind_user;"
