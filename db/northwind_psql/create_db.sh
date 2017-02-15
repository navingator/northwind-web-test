#!/bin/bash
# Adapted from https://github.com/pthom/northwind_psql

dropdb northwind
dropuser northwind_user

createdb northwind
psql northwind < northwind.sql

psql template1 -c "CREATE USER northwind_user;"
psql template1 -c "GRANT ALL ON DATABASE northwind TO northwind_user;"
psql northwind -c "GRANT ALL ON ALL tables IN SCHEMA public TO northwind_user"
