# Etapa 1: build
# Compilamos la SPA de React (TypeScript + Vite) a archivos estáticos.
FROM node:22-alpine AS build

WORKDIR /app

# Copiamos primero solo los archivos de dependencias: si package.json no
# cambia, Docker reutiliza esta capa cacheada y no vuelve a bajar todo npm.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# "docker" es un modo propio (ver .env.docker) para no usar por accidente
# frontend/.env.production, que apunta a una URL de producción real.
RUN npm run build:docker

# Etapa 2: runtime
# nginx solo sirve los archivos estáticos generados (dist/); no necesita
# Node ni nada del toolchain de build.
FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
