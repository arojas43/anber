# Dockerfile for frontend
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

RUN apk add --no-cache gettext

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf.template

EXPOSE 80

# envsubst replaces ${BACKEND_URL} at runtime; other nginx $ vars are left untouched
CMD ["/bin/sh", "-c", "envsubst '${BACKEND_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"]
