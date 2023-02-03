cd /home/ubuntu/build
sudo npm ci
sudo npm run build
sudo pm2 delete 0
sudo npm run start:prod