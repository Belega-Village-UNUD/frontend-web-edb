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
  docker stack deploy -c ./docker/ssl/docker-compose.yml ssl 

  if [ $? -ne 0]; then
    echo "Failed to deploy nginx ssl service"
    exit 1
  fi
fi

docker config ls | grep "febelega.conf"

if [ $? -ne 0]; then
  export $(cat .env) > /dev/null 2>&1; envsubst < nginx/templates/febelega.conf.template > nginx/templates/febelega.conf
  if [ $? -ne 0]; then
    echo "Failed to deploy nginx ssl service"
    exit 1
  fi
  
  docker config create febelega.conf ./nginx/templates/febelega.conf

  if [ $? -ne 0]; then
    echo "Failed to create config for frontend route"
    exit 1
  fi

  echo "Successfully created config for frontend route" 

else

  echo "Config file for frontend route is available, updating now...."

  if [ $? -ne 0]; then
    echo "Failed to create config for frontend route"
    exit 1
  fi

  echo "Updating config frontend route in ssl service"
  docker service update --config-rm febelega.conf ssl_nginx

  if [ $? -ne 0]; then
    echo "Failed to update config for frontend in ssl service"
    exit 1
  fi

  echo "Updating configuration for frontend route"
  docker config rm febelega.conf

  if [ $? -ne 0]; then
    echo "Failed to create update for frontend route"
    exit 1
  fi

  docker config create febelega.conf ./nginx/templates/febelega.conf

  if [ $? -ne 0]; then
    echo "Failed updating config for frontend route"
    exit 1
  fi
fi

docker service update --config-add source=febelega.conf,target=/etc/nginx/conf.d/febelega.conf,mode=0440 ssl_nginx

if [ $? -ne 0]; then
  echo "Failed updating config for frontend route on ssl service"
  exit 1
fi

echo "Successfully updating frontend config on service ssl_nginx"

echo "Successfully deploy the image for ghcr.io/belega-village-unud/frontend-web-edb:$COMMIT_SHA on service frontend_web_app"

docker service ls | grep frontend_web_app | awk '{print $2, $3, $4, $5}'
docker service ls | grep ssl_nginx | awk '{print $2, $3, $4, $5}'
