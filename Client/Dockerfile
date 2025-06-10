FROM node:24-alpine3.21

WORKDIR /frontend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD [ "sh", "-c", "npm run dev" ]
