FROM node:18-alpine AS build

ARG VERSION
ARG VITE_APP_API_URL
ARG VITE_APP_SENTRY_DSN
ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN ${SENTRY_AUTH_TOKEN}
ENV VITE_APP_API_URL ${VITE_APP_API_URL}
ENV VITE_APP_SENTRY_DSN ${VITE_APP_SENTRY_DSN}

WORKDIR /build

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .

RUN yarn install --freeze-lockfile --network-timeout 3600000

COPY . .

RUN yarn build

#RUN yarn run sentry-cli sourcemaps inject --org video-annotator --project video-annotator-frontend -r $VERSION ./dist && \
#    yarn run sentry-cli sourcemaps upload --org video-annotator --project video-annotator-frontend -r $VERSION ./dist

FROM nginx:1.18-alpine

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /build/dist /frontend/build
