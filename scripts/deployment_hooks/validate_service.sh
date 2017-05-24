#!/bin/bash

API_PROCESS_NAME=spout360-api-test

count=$($pm2 list | grep -v $API_PROCESS_NAME | grep -v grep)

if [ -n "$count" ]; then
  exit 1
fi

exit 0
