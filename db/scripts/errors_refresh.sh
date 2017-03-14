#!/bin/bash

# Gets the base directory for this file and it's operations
DIR="$(dirname $(readlink -f $0))"
DB="${1:-northwind}"

psql $DB < $DIR/../extensions/errors.sql
psql $DB -c "COPY errors FROM '$DIR/../data/errors.csv' CSV HEADER"
