#!/bin/bash

codedir="/home/ec2-user/spout360-api-test"
pm2=$(which pm2)

cd $codedir
$pm2 restart server.js
