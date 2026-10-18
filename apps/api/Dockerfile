FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
COPY apps/client/package.json apps/client/package.json
COPY apps/api/package.json apps/api/package.json
RUN npm install
COPY apps/api apps/api
RUN npm run build -w @ember/api

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json* ./
COPY apps/client/package.json apps/client/package.json
COPY apps/api/package.json apps/api/package.json
RUN npm install --omit=dev
COPY --from=build /app/apps/api/dist apps/api/dist
EXPOSE 3001
CMD ["node", "apps/api/dist/index.js"]
