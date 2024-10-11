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

echo "Performing build for $BRANCH";

set -x
docker image prune -f;

docker build . \
  -t ghcr.io/belega-village-unud/frontend-web-edb:$COMMIT_SHA \
  -t ghcr.io/belega-village-unud/frontend-web-edb:$BRANCH

if [ $? -ne 0 ]; then
    echo "Error in build $BRANCH for Frontend Web Belega Service $?"
    exit 1
fi

set +x

echo "Successfully build the image for ghcr.io/belega-village-unud/frontend-web-edb:$COMMIT_SHA"
