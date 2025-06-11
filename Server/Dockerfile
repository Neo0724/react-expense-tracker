FROM node:20-alpine3.22

WORKDIR /backend

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD [ "sh", "-c", "npm run dev" ]
