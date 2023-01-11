cd ..

git pull

ls

sudo docker build -f Website/Dockerfile -t picam-home-security-website .

cd devops

chmod u+x stop.sh
chmod u+x start.sh

sudo docker compose up -d