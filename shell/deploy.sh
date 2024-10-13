#!/bin/bash

BRANCH=$1
COMMIT_SHA=$2

echo $BRANCH;

if [ "$(git rev-parse --abbrev-ref HEAD)" != "$BRANCH" ]; then
    echo "this branch is not up to date"
    git checkout $BRANCH;
    git fetch --dry-run;
fi

docker service ls | grep "frontend_web_app"

if [ $? -ne 0 ]; then
  export $(cat .env) >  /dev/null 2>&1; docker stack deploy -c ./docker/service/docker-compose.yml frontend_web
  if [ $? -ne 0 ]; then
      echo "Error in deploying $BRANCH of Frontend Belega Service"
      exit 1
  fi
else
  docker service update --force --image ghcr.io/belega-village-unud/frontend-web-edb:$COMMIT_SHA frontend_web_app
  if [ $? -ne 0 ]; then
      echo "Error in deploying $BRANCH of Frontend Belega Service"
      exit 1
  fi
fi

docker service ls | grep "ssl_nginx"

if [ $? -ne 0 ]; then
  export $(cat .env) > /dev/null 2>&1; docker stack deploy -c ./docker/ssl/docker-compose.yml ssl
  if [ $? -ne 0 ]; then
      echo "Error in deploying $BRANCH of SSL Belega Service"
      exit 1
  fi
else
  docker stack deploy -c ./docker/ssl/docker-compose.yml ssl
  if [ $? -ne 0 ]; then
      echo "Error in deploying $BRANCH of SSL Belega Service"
      exit 1
  fi
fi

echo "Successfully deploy the image for ghcr.io/belega-village-unud/frontend-web-edb:$COMMIT_SHA on service frontend_web_app"

docker service ls | grep frontend_web | awk '{print $2, $3, $4, $5}'
