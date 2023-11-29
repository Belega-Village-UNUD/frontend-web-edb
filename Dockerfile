# TODO 
# - Add a multi-stage build to reduce the size of the image
# and only include the necessary files, 
# create distroless image
FROM node:20.9-alpine
WORKDIR /usr/app
COPY ./package.json ./
RUN npm install
COPY ./ ./
COPY .env .env.local
EXPOSE ${PORT}
RUN npm run build
CMD ["npm", "run", "start"]
