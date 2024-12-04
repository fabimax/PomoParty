
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

# Expose ports for API server and reverse proxy
EXPOSE 8000 8080

# Start the application
CMD [ "node", "backend/main.js" ] 