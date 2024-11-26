# Use Caddy server image from Dockerhub
FROM caddy:2.8.4-alpine

# Copy the Caddy configuration file
COPY Caddyfile /etc/caddy/Caddyfile

# Expose ports for Caddy (web server - proxy)
EXPOSE 80 443

# Start Caddy server
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
