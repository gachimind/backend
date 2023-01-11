#!/bin/bash
REPOSITORY=/home/ubuntu/build

cd $REPOSITORY/project
    npm i
    pm2 delete 0
    npm run start:prod

