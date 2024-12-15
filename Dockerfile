FROM node:20-alpine

WORKDIR /

COPY . .

RUN npm ci --omit=dev --prefer-offline

EXPOSE 3000
CMD ["npm", "run", "start:prod"]