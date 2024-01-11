build:
	docker build . --file docker/service/Dockerfile -t ghcr.io/belega-village-unud/frontend-web-edb:v1 -t ghcr.io/belega-village-unud/frontend-web-edb:latest

up:
	# docker run -it -d --name frontend-web-edb-container -p 3000:3000 --env-file .env ghcr.io/belega-village-unud/frontend-web-edb:latest 
	docker compose -p frontend_belega --file docker/service/docker-compose.yml --env-file .env up -d --force-recreate 
	docker compose -p frontend_belega --file docker/ssl/docker-compose.yml --env-file .env up nginx -d --force-recreate

down:
	# docker stop frontend-web-edb-container
	docker compose -p frontend_belega --file docker/service/docker-compose.yml --env-file .env down
	docker compose -p frontend_belega --file docker/ssl/docker-compose.yml --env-file .env down nginx 

rm:
	#docker rm frontend-web-edb-container
	docker compose -p frontend_belega --file docker/service/docker-compose.yml --env-file .env rm 
	
restart_nginx:
	docker compose -p frontend_belega --file docker/ssl/docker-compose.yml --env-file .env restart nginx

ps:
	docker compose -p frontend_belega --file docker/service/docker-compose.yml --env-file .env ps 

gen_key:
	# generate ssl key 
	mkdir ./nginx/dhparam
	openssl dhparam -out ./nginx/dhparam/dhparam-2048.pem 2048

ssl:
	sudo docker compose -p frontend_belega --file docker/ssl/docker-compose.yml --env-file .env up nginx -d

dns:
	docker compose -p frontend_belega --file docker/ssl/docker-compose.yml --env-file .env up duckdns certbot certbot_cron -d

add-docker:
	sudo apt-get update
	sudo apt-get -y  install ca-certificates curl gnupg
	sudo install -m 0755 -d /etc/apt/keyrings
	curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
	sudo chmod a+r /etc/apt/keyrings/docker.gpg
	echo \
		"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
		$(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
		sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
	sudo apt-get update
	sudo apt-get -y  install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
	sudo groupadd docker
	sudo usermod -aG docker $USER
	newgrp docker
	sudo apt install make

