#!/bin/bash

API_PROCESS_NAME=spout360-api-test
codedir="/home/ec2-user/Spout/api"
count=$(pm2 list | grep $API_PROCESS_NAME | grep -v grep)

cd $codedir
if [ -n "$count" ]; then
    pm2 restart server.js
else
    pm2 start server.js --name $API_PROCESS_NAME
fi
