#!/bin/bash
docker stop knocky-proxy 2>/dev/null
docker rm knocky-proxy 2>/dev/null
docker run -d --name knocky-proxy --restart unless-stopped -p 8080:8080 --env-file .env knocky-proxy
echo "Running. Stop with: docker stop knocky-proxy"
