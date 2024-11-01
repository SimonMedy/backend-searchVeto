#!/bin/bash
set -e

DEST_DIR="/var/lib/mysql"

if [ "$(ls -A $DEST_DIR)" ]; then
  echo "The directory $DEST_DIR is not empty. Skipping data extraction."
else
  echo "The directory $DEST_DIR is empty. Extracting backup data."

  tar -xzvf /docker-entrypoint-initdb.d/backend_searchVeto_data.tar.gz -C $DEST_DIR --strip-components=1

  chown -R mysql:mysql $DEST_DIR
fi

exec docker-entrypoint.sh mysqld
