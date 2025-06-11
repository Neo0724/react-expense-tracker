FROM node:20-alpine3.22

WORKDIR /frontend

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 5173

CMD [ "sh", "-c", "npm run dev" ]
