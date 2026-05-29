FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production 

FROM node:20-alpine AS test
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm test 

FROM node:20-alpine AS production 
ARG BUILD_DATE
ARG VERSION
ARG NODE_ENV=production 
LABEL org.opencontainers.image.created=$BUILD_DATE \
      org.opencontainers.image.version=$VERSION \
      org.opencontainers.image.title="backend" 
WORKDIR /app 
RUN apk add --no-cache wget tini 
RUN addgroup -S app && adduser -S app -G app 
COPY --from=deps --chown=app:app /app/node_modules ./node_modules 
COPY --chown=app:app . . 
USER app

EXPOSE 3000 
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1 
ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "backend.js"]