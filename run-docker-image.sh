#!/bin/bash

docker run -d \
  --name pomoparty \
  -p 8000:8000 \
  -p 8100:8100 \
  --env-file .env \
  -v $(pwd)/database.sqlite:/usr/src/app/database.sqlite \
  lizlovelace/pomoparty

