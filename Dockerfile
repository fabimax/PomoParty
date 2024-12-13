# Use Node.js LTS version
FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

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

# Start the application
CMD [ "npm", "run", "backend-start" ] 