#!/bin/bash

tmpdir="/tmp"
codedir="/home/ec2-user/spout360-api-test"

if [ ! -d $codedir ]; then
  exit 0
fi

if [ ! -d "${tmpdir}${codedir}" ]; then
  mkdir -p "${tmpdir}${codedir}"
fi

cp $codedir/.env ${tmpdir}${codedir}/.env
