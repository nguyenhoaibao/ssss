#!/bin/bash

if [ -f ../.env ]; then
    export $(cat ../.env | grep MYSQL | xargs)
fi

if [ -z $MYSQL_HOST ]; then
    echo "MYSQL_HOST is required"
    exit 1
fi

if [ -z $MYSQL_USERNAME ]; then
    echo "MYSQL_USERNAME is required"
    exit 1
fi

if [ -z $MYSQL_DBNAME ]; then
    echo "MYSQL_DBNAME is required"
    exit 1
fi

MYSQL_PASSWORD="${MYSQL_PASSWORD:-""}"
MYSQL_PORT="${MYSQL_PORT:-3306}"

url="mysql://${MYSQL_USERNAME}:${MYSQL_PASSWORD}@${MYSQL_HOST}:${MYSQL_PORT}/${MYSQL_DBNAME}"

up() {
  cd ..
  ./node_modules/.bin/sequelize db:migrate --url $url
}

down() {
  cd ..
  ./node_modules/.bin/sequelize db:migrate:undo --url $url
}

case "$1" in
  up)
    up
    ;;
  down)
    down
    ;;
  *)
    echo -e "Usage: $0 {up|down}\n"
    exit 1
esac
