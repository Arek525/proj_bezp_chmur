# —————————————————————————————————————————
# Etap 1: Budowanie aplikacji
# —————————————————————————————————————————
FROM node:18-alpine AS builder
WORKDIR /app

# Zainstaluj zależności
COPY package.json package-lock.json ./
RUN npm ci

# Zbuduj aplikację
COPY . .
RUN npm run build

# —————————————————————————————————————————
# Etap 2: Serwowanie przez NGINX
# —————————————————————————————————————————
FROM nginx:alpine
# Usuń domyślną zawartość
RUN rm -rf /usr/share/nginx/html/*

# Skopiuj wybudowane pliki
COPY --from=builder /app/build /usr/share/nginx/html

# (Opcjonalnie) Kopia własnej konfiguracji NGINX:
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
