build:
	docker build . -t ghcr.io/belega-village-unud/frontend-web-edb:v1 -t ghcr.io/belega-village-unud/frontend-web-edb:latest

start:
	docker run -it -d --name frontend-web-edb-container -p 3000:3000 --env-file .env ghcr.io/belega-village-unud/frontend-web-edb:latest 

stop:
	docker stop frontend-web-edb-container

remove:
	docker rm frontend-web-edb-container
	
