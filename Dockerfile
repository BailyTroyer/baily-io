FROM node:14.11.0-alpine AS base
# Install base dependencies
RUN apk add --update autoconf automake libtool make tiff jpeg zlib zlib-dev pkgconf nasm file gcc musl-dev

FROM base
# Add app-specific dependencies
WORKDIR /app
COPY ./package*.json /app/
RUN yarn install
