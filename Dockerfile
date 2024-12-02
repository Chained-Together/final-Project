FROM node:20

WORKDIR /var/app
RUN mkdir -p /var/app
COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start", "test"]