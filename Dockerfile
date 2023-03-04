FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN npm install pm2 -g
RUN npm install
CMD ["pm2-runtime", "app.js"]
