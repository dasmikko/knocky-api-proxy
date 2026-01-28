FROM node:24-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY proxy.js .
EXPOSE 8080
CMD ["node", "proxy.js"]
