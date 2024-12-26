# Use Node.js LTS version as the base image
FROM node:22.12

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json if applicable
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the WebSocket port (8080 in your code)
EXPOSE 8080

# Start the application
CMD ["node", "server.js"]