# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci --prefer-offline --no-audit --legacy-peer-deps || npm install --prefer-offline --no-audit --legacy-peer-deps

COPY . .

RUN npm run build -- --configuration production

# Stage 2: Production
FROM nginx:alpine

COPY --from=build /app/dist/tuempleo-front/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint-custom.sh /docker-entrypoint-custom.sh

RUN chmod +x /docker-entrypoint-custom.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint-custom.sh"]