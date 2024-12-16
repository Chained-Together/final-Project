FROM node:20-alpine

WORKDIR /

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start:prod"]