# Use Node.js LTS version as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json if applicable
COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

EXPOSE 3000

# Start the application
CMD ["npm", "start"]