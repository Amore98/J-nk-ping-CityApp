FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json .
RUN npm i
COPY . .
EXPOSE 8080
CMD ["node", "index.js"]