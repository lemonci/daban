#!/bin/bash
source ../../scripts/cli.sh

docker build \
  --build-arg CACHEBUST=$(date +%s) \
  --file Dockerfile \
  --tag freesewing/backend:${FREESEWING_VERSION_TAG} \
  --tag freesewing/backend:latest \
  --label "org.opencontainers.image.authors=info@freesewing.eu" \
  --label "org.opencontainers.image.created=$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  --label "org.opencontainers.image.description=FreeSewing Backend REST API" \
  --label "org.opencontainers.image.documentation=https://freesewing.dev/" \
  --label "org.opencontainers.image.license=MIT" \
  --label "org.opencontainers.image.revision=$(git rev-parse HEAD)" \
  --label "org.opencontainers.image.source=https://codeberg.org/freesewing/freesewing" \
  --label "org.opencontainers.image.title=FreeSewing Backend" \
  --label "org.opencontainers.image.url=https://hub.docker.com/r/freesewing/backend" \
  --label "org.opencontainers.image.vendor=FreeSewing" \
  --label "org.opencontainers.image.version=$FREESEWING_VERSION_TAG" \
  .
