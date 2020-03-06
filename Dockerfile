# dotsby-backend Dockerfile

# --------- Base image --------------
FROM node:13.8.0

# Meta data
LABEL description="Dotsby Docs"
LABEL MAINTAINER="qinmu magenta2127@gmail.com"

# Install yarn
RUN curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 1.22.0

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install

# Bundle app source
COPY . .
RUN yarn build

# set environment variables
ENV NODE_ENV="production"

EXPOSE 8080

# Start
CMD [ "yarn", "bootstrap" ]
