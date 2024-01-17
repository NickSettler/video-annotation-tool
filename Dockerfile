FROM node:18-alpine AS build

ARG VERSION
ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN ${SENTRY_AUTH_TOKEN}

WORKDIR /build

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .

RUN yarn install --freeze-lockfile --network-timeout 3600000

COPY . .

RUN yarn build

RUN sentry-cli sourcemaps inject --org video-annotator --project video-annotator-frontend -r $VERSION ./build && \
    sentry-cli sourcemaps upload --org video-annotator --project video-annotator-frontend -r $VERSION ./build

FROM nginx:1.18-alpine

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /build/build /frontend/build
