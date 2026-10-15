# One container for tetris-vs: the API serves the built web app on the same origin (no CORS).

FROM node:24-alpine AS build
WORKDIR /app

# Dependencies first, so source changes do not reinstall them.
COPY package.json package-lock.json .npmrc ./
COPY packages/shared/package.json packages/shared/
COPY packages/config/package.json packages/config/
COPY apps/web/package.json apps/web/.npmrc apps/web/
COPY apps/api/package.json apps/api/
RUN npm ci --no-audit --no-fund

COPY . .
# "/" makes the client connect to the page's own origin, whatever host and port serve it.
ENV VITE_API_SERVER=/
RUN npm run build -w web && npm run build -w api

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    SERVER=0.0.0.0
# The API serves ./dist relative to its working directory: that is the web build.
COPY --from=build /app/apps/api/dist/bundle.js ./server/bundle.js
COPY --from=build /app/apps/web/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "server/bundle.js"]
