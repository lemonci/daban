#!/bin/bash
#
# First create & populate the database
rm -f ./tests/database.sqlite*
sqlite3 ./tests/database.sqlite < ./database-schema.sql
sqlite3 ./tests/database.sqlite < ./tests/database-test-data.sql

# Then prepare the environment
export BACKEND_DB_PATH="./tests/database.sqlite"
export BACKEND_PORT=3001
export BACKEND_URL="http://localhost:3001"
export BACKEND_WEBSITE_DOMAIN=localhost:3000
export BACKEND_WEBSITE_SCHEME=http

# Clean up media folder
rm -rf ./tests/media

# Ready to run tests
