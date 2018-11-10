FROM node:10

EXPOSE 5000

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app 

COPY package.json ./usr/src/app/package.json

RUN npm install 

COPY . . 




