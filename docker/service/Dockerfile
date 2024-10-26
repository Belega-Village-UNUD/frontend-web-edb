FROM node:20.9.0-alpine as build

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM gcr.io/distroless/nodejs20 as environment

ENV NODE_ENV production
ENV FRONT_WEB_PORT ${PORT}
ENV NEXT_TELEMETRY_DISABLED 1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

EXPOSE $FRONT_WEB_PORT

COPY --from=build /app/next.config.js ./
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

CMD ["./node_modules/next/dist/bin/next", "start"]
