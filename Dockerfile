FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

# For the core api we need to run the build script on port 4000 
EXPOSE 4000

CMD [ "npm", "start"]