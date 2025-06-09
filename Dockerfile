# Use the official Node.js image as the base image
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the project files to the container
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Run the app in development mode
CMD ["npm", "run", "dev"]
