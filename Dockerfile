# Use the Node.js Alpine image from the Dockerhub
FROM node:alpine

RUN apk --no-cache add curl

# Set app directory
WORKDIR /usr/src/app

# Install your app dependencies
# Use wildcard to ensure both package.json AND package-lock.json are considered
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Set NODE_ENV environment variable from the build argument. Default to "development" if not provided
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

# Copy the appropriate .env file based on the build-time ARG
COPY .env.$NODE_ENV .env

# Your app runs on port 5000
EXPOSE 5000

# Start the application
CMD [ "npm", "start" ]
