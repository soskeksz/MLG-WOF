FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN mkdir -p .next && chown -R node:node .next

USER node

EXPOSE 3000

CMD ["npm", "run", "dev"]
