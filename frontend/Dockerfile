FROM node:20-alpine AS deps 
WORKDIR /app
COPY package*.json ./ 
RUN npm ci
 
FROM node:20-alpine AS build 
WORKDIR /app 
COPY --from=deps /app/node_modules ./node_modules
COPY . . 
RUN npm run build
RUN ls -la /app 

FROM nginx:alpine AS production 
ARG BUILD_DATE
ARG VERSION
ARG NODE_ENV=production
LABEL org.opencontainers.image.created=$BUILD_DATE \
      org.opencontainers.image.version=$VERSION \
      org.opencontainers.image.title="frontend"
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
RUN apk update && apk add curl && mkdir -p /var/log/nginx && \
    chown -R app:app /var/log/nginx && \
    chmod -R 755 /var/log/nginx && \
    mkdir -p /var/cache/nginx && \
    chown -R app:app /var/cache/nginx && \
    chown -R app:app /etc/nginx && \
    chmod -R 755 /etc/nginx

RUN touch /var/run/nginx.pid && \
        chown -R app:app /var/run/nginx.pid /run/nginx.pid
COPY --from=build --chown=app:app /app/build /usr/share/nginx/html
COPY --chown=app:app nginx.conf /etc/nginx/nginx.conf   
USER app

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:80 || exit 1