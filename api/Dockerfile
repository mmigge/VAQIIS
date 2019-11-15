FROM node:10-alpine

WORKDIR /usr/src/api

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 9000

CMD ["npm", "start"]
