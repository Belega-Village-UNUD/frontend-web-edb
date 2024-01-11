build:
	docker build . --file docker/service/Dockerfile -t ghcr.io/belega-village-unud/frontend-web-edb:v1 -t ghcr.io/belega-village-unud/frontend-web-edb:latest

up:
	# docker run -it -d --name frontend-web-edb-container -p 3000:3000 --env-file .env ghcr.io/belega-village-unud/frontend-web-edb:latest 
	docker compose -p frontend_belega --file docker/service/docker-compose.yml --env-file .env up -d --force-recreate 
	docker compose -p frontend_belega --file docker/ssl/docker-compose.yml --env-file .env up nginx -d --force-recreate

stop:
	docker stop frontend-web-edb-container

remove:
	docker rm frontend-web-edb-container
	
