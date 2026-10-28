FROM node:24-alpine

WORKDIR /frontend

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 5173

CMD [ "sh", "-c", "npm run dev" ]
