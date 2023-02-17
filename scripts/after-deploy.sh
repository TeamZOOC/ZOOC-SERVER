#!/bin/bash
REPOSITORY=/home/ubuntu/build

cd $REPOSITORY

sudo /usr/bin/yarn
sudo /usr/bin/yarn run db:pull
sudo /usr/bin/yarn prisma generate 
sudo /usr/bin/pm2 start dist
# sudo /usr/bin/pm2 logs
