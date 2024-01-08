# Create the base
FROM node:20.9-alpine as base
WORKDIR /usr/app
COPY ./package.json ./
RUN npm install
COPY ./ ./
COPY .env .env.local
EXPOSE ${PORT}
RUN npm run build
CMD ["npm", "run", "start"]
