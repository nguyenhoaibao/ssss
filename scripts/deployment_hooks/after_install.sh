#!/bin/bash

. /home/ec2-user/.bashrc

codedir="/home/ec2-user/Spout/api"
npm=$(which npm)

cd $codedir
$npm install && $npm run db:migrate
