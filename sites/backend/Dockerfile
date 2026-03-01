## Stage 1: Builder
FROM node:lts-alpine AS builder

## Set workdir
WORKDIR /backend

## Install node dependencies
COPY package.json ./
RUN npm install

## Build app
COPY src src
COPY openapi openapi
COPY public public
COPY local-config.mjs local-config.mjs
COPY sluglist.mjs sluglist.mjs
COPY build.mjs build.mjs
RUN npm run build

## Stage 2: App
FROM node:lts-alpine AS app

## Set workdir
WORKDIR /backend

# Install PM2
RUN npm install pm2

## Copy what we need from the builder
COPY --from=builder /backend/dist/ /backend/dist/
COPY --from=builder /backend/package.json /backend/package.json
COPY --from=builder /backend/local-config.mjs /backend/
COPY --from=builder /backend/sluglist.mjs /backend/
COPY --from=builder /backend/public/ /backend/public/

## Add a user to run the app
RUN addgroup \
    --gid "2000" \
    "freesewing" \
 && adduser \
    --uid "2000" \
    --no-create-home \
    --home "/backend" \
    --disabled-password \
    --ingroup "freesewing" \
    freesewing
RUN chown -R freesewing /backend

## Drop privleges and run app
USER freesewing
CMD ["./node_modules/.bin/pm2-runtime",  "./dist/index.mjs"]

