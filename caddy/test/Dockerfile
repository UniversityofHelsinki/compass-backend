# Use the Caddy image from Docker Hub
FROM caddy:2.4.5-alpine

# Create a non-root user and group
RUN addgroup -S caddygroup && adduser -S caddyuser -G caddygroup

# Set the working directory
WORKDIR /srv

# Copy the Caddy configuration file
COPY Caddyfile /etc/caddy/Caddyfile

# Change ownership of the relevant directories to the non-root user
RUN chown -R caddyuser:caddygroup /srv /etc/caddy

# Switch to the non-root user
USER caddyuser

# Expose the necessary ports
EXPOSE 80
EXPOSE 443

# Run Caddy
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
