# Use Node.js LTS version
FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Install SQLite tools
RUN apt-get update && apt-get install -y sqlite3 && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build frontend assets
RUN npm run frontend-build

# Expose ports for API server and reverse proxy
EXPOSE 8000 8100

# Create a startup script
RUN echo '#!/bin/sh\n\
npm run database-apply-migrations\n\
exec npm run backend-start\n\
' > /usr/src/app/docker-entrypoint.sh && chmod +x /usr/src/app/docker-entrypoint.sh

# Start the application
CMD ["/usr/src/app/docker-entrypoint.sh"] 