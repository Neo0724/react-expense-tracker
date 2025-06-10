FROM node:24-alpine3.21

WORKDIR /backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "sh", "-c", "npm run dev" ]
