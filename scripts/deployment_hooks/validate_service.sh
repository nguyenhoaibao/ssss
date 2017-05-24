#!/bin/bash

. /home/ec2-user/.bashrc

API_PROCESS_NAME=spout360-api-test
count=$(pm2 list | grep $API_PROCESS_NAME | grep -v grep)

if [ -z "$count" ]; then
  exit 1
fi

exit 0
