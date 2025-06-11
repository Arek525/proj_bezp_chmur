FROM node:18-alpine
WORKDIR /app

COPY package.json package-lock.json ./
ENV NODE_ENV=production
RUN npm i


COPY . .