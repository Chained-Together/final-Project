FROM node:20-alpine

WORKDIR /

COPY . .

RUN npm install --omit=dev

EXPOSE 3000
CMD ["npm", "run", "start:prod"]