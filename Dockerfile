# Set the base image to Ubuntu
FROM node

RUN mkdir -p /usr/app

WORKDIR /usr/app

# Copy package & package-lock.json
COPY package*.json .
COPY yarn.lock .
RUN npm install -g --quiet yarn

# Copy everything
COPY . .
