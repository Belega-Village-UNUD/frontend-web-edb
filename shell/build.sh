#!/bin/bash

if [ -z $1  ]; then
    echo "Please provide the external branch name the first argument"
    exit 1
fi

if [ -z $2  ]; then
    echo "Please provide the commit sha the second argument"
    exit 1
fi

BRANCH=$1
COMMIT_SHA=$2

set -x

echo "Performing build for $BRANCH";

if [ "$(git rev-parse --abbrev-ref HEAD)" != "$BRANCH" ]; then
    echo "this branch is not up to date"
    git checkout $BRANCH;
    git fetch --dry-run;
fi

git pull origin $BRANCH;

if [ $? -ne 0 ]; then
    echo "Error in pull and fetch $BRANCH of Backend Belega Service $?"
    exit 1
fi


docker image prune -f;

if [ $? -ne 0 ]; then
    echo "Error in pruning images $?"
fi

docker build . --file docker/service/Dockerfile \
  -t ghcr.io/belega-village-unud/frontend-web-edb:$COMMIT_SHA \
  -t ghcr.io/belega-village-unud/frontend-web-edb:$BRANCH

if [ $? -ne 0 ]; then
    echo "Error in build $BRANCH for Frontend Web Belega Service $?"
    exit 1
fi

set +x

echo "Successfully build the image for ghcr.io/belega-village-unud/frontend-web-edb:$COMMIT_SHA"
