#!/bin/bash

. /home/ec2-user/.bashrc

codedir="/home/ec2-user/Spout/api"

cd $codedir
npm install && npm run db:migrate
