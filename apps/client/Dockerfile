FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
COPY apps/client/package.json apps/client/package.json
COPY apps/api/package.json apps/api/package.json
RUN npm install
COPY apps/client apps/client
RUN npm run build -w @ember/client

FROM nginx:1.27-alpine
COPY apps/client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/client/dist /usr/share/nginx/html
EXPOSE 80
