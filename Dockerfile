# Create the base
FROM node:20.9-alpine as base
WORKDIR /usr/app
COPY ./package.json ./
RUN npm install
COPY ./ ./
COPY .env .env.local

# Build
FROM base as build
WORKDIR /build
COPY --from=base ./usr/app ./
RUN npm run build

