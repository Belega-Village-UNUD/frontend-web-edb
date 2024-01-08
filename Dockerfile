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

# Distroless Image
FROM gcr.io/distroless/nodejs:16
ENV NODE_ENV=development
WORKDIR /app

COPY --from=build /build/package*.json ./
COPY --from=build /build/.next ./.next
COPY --from=build /build/public ./public
COPY --from=build /build/node_modules ./node_modules
COPY --from=build /build/next.config.js ./

EXPOSE ${PORT}
CMD ["node_modules/.bin/next", "start"]

