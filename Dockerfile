# Set the base image to Ubuntu
FROM node

RUN mkdir -p /usr/app

WORKDIR /usr/app

# Copy package & package-lock.json
COPY yarn.lock .
RUN npm install -g --quiet yarn
RUN yarn install --silent --force

# Copy everything
COPY . .
