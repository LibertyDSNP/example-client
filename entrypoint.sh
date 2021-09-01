#!/bin/bash

## start static server
#cd ./static-server
#npm run start -D status=$?
#
#if [ $status -ne 0 ]; then
#  echo "Failed to start my_first_process: $status"
#  exit $status
#fi
#
#
#if [ $status == 0 ]; then
#  echo "process started successfully: $status"
#  exit $status
#fi
# back to source
#cd ..
echo "we are here"

# start example-client
npm run build
npm run start

#if [ $status -ne 0 ]; then
#  echo "Failed to start my_second_process: $status"
#  exit $status
#fi
#
#if [ $status == 0 ]; then
#  echo "second process started successfully: $status"
#  exit $status
#fi
