#!/bin/sh

# Use Railway's PORT environment variable, default to 80 if not set
PORT=${PORT:-80}

# Replace the port in nginx config
sed -i "s/listen 80;/listen $PORT;/" /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g 'daemon off;'
