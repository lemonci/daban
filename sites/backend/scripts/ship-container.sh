#!/bin/bash
source ../../scripts/cli.sh

docker push freesewing/backend:${FREESEWING_VERSION_TAG}
docker push freesewing/backend:latest
