#!/bin/bash

. /home/ec2-user/.bashrc

codedir="/home/ec2-user/spout360-api-test"
npm=$(which npm)

cd $codedir
$npm install
$npm run db:migrate
