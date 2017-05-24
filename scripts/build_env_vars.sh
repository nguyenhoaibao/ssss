#!/bin/bash

stg_env() {
    cat > .env <<EOF
    NODE_ENV=staging

    APP_NAME=Spout360 API Staging
    APP_PORT=$APP_NAME_STG

    MYSQL_HOST=$MYSQL_HOST_STG
    MYSQL_PORT=$MYSQL_PORT_STG
    MYSQL_USERNAME=$MYSQL_USERNAME_STG
    MYSQL_PASSWORD=$MYSQL_PASSWORD_STG
    MYSQL_DBNAME=$MYSQL_DBNAME_STG
    MYSQL_ENGINE=$MYSQL_ENGINE
    MYSQL_CHARSET=$MYSQL_CHARSET
    MYSQL_COLLATE=$MYSQL_COLLATE

    SWAGGER_DOC=$SWAGGER_DOC_STG

    LOG_STDOUT=$LOG_STDOUT_STG
    LOG_FILE=$LOG_FILE_STG
    EOF
}

test_env() {
    cat > .env <<EOF
    NODE_ENV=test

    APP_NAME=Spout360 API TEST
    APP_PORT=$APP_NAME_TEST

    MYSQL_HOST=$MYSQL_HOST_TEST
    MYSQL_PORT=$MYSQL_PORT_TEST
    MYSQL_USERNAME=$MYSQL_USERNAME_TEST
    MYSQL_PASSWORD=$MYSQL_PASSWORD_TEST
    MYSQL_DBNAME=$MYSQL_DBNAME_TEST
    MYSQL_ENGINE=$MYSQL_ENGINE
    MYSQL_CHARSET=$MYSQL_CHARSET
    MYSQL_COLLATE=$MYSQL_COLLATE

    SWAGGER_DOC=$SWAGGER_DOC_TEST

    LOG_STDOUT=$LOG_STDOUT_TEST
    LOG_FILE=$LOG_FILE_TEST
    EOF
}

case $CIRCLE_BRANCH in
    develop)
        stg_env
        ;;
    *)
        test_env
        ;;
esac