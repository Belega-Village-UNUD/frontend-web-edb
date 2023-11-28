build:
	docker build . -t belega-squad/frontend-web-edb:latest

start:
	docker run -it -d --name frontend-web-edb-container -p 3000:3000 --env-file .env belega-squad/frontend-web-edb:latest 
