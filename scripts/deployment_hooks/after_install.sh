#!/bin/bash

. /home/ec2-user/.bashrc

tmpdir="/tmp"
codedir="/home/ec2-user/spout360-api-test"
npm=$(which npm)

if [ -f ${tmpdir}${codedir}/.env ]; then
  cp ${tmpdir}${codedir}/.env $codedir/.env
else
  cp $codedir/.env.example $codedir/.env
fi

cd $codedir
$npm install
$npm run db:migrate:downall
$npm run db:migrate
