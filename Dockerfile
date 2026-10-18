FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/client/package.json apps/client/package.json
COPY apps/api/package.json apps/api/package.json
RUN npm install

COPY apps ./apps
RUN npm run build

FROM node:22-alpine AS runtime

ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/client/package.json apps/client/package.json
COPY apps/api/package.json apps/api/package.json
RUN npm install --omit=dev

COPY --from=build /app/apps/api/dist apps/api/dist
COPY --from=build /app/apps/client/dist apps/client/dist

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/api/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

CMD ["node", "apps/api/dist/index.js"]
