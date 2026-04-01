#!/bin/sh
# entrypoint.sh - Substitute environment variables in static files

echo "Replacing API and Keycloak URLs..."

# Replace localhost URLs to use Docker internal network (for fallback)
sed -i "s|http://localhost:5150/api|http://webapi:5150/api|g" /usr/share/nginx/html/index.html
sed -i "s|http://localhost:8088|http://keycloak:8080|g" /usr/share/nginx/html/index.html

echo "Starting nginx..."
exec nginx -g "daemon off;"