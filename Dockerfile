FROM node:14.17-alpine3.14
WORKDIR /app
USER root
RUN apk --update add bash tini

COPY package.json package-lock.json ./
RUN npm ci

ARG REACT_APP_UPLOAD_HOST=""
ARG REACT_APP_CHAIN_ID="31337"
ARG REACT_APP_CHAIN_NAME="Localchain"
ARG REACT_APP_CHAIN_HOST="http://localhost:8545"
ARG REACT_APP_TORUS_BUILD_ENV="testing"

COPY src src/
COPY serve.json serve.json
COPY static-server/ ./static-server/
COPY scripts ./scripts/
COPY config ./config/
COPY bin ./bin/
COPY public ./public/
COPY tsconfig.json tsconfig.json
EXPOSE 8080

RUN echo `ls -la`

RUN mkdir build

RUN npm run build
RUN cp -r build ./static-server/build/

WORKDIR /app/static-server
RUN npm ci

ENV REACT_APP_CHAIN_ID test
ENV REACT_APP_CHAIN_HOST test
ENV REACT_APP_CHAIN_NAME test
ENV REACT_APP_TORUS_BUILD_ENV test
ENV REACT_APP_UPLOAD_HOST test

ENTRYPOINT ["npm", "run", "start"]
