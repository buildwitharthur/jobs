# Build a partir da raiz do repositório:
#   docker build -f apps/web/Dockerfile -t job-web .
# Endereço da API (o navegador é quem chama): --build-arg VITE_API_URL=http://localhost:3000
FROM node:24-alpine

RUN apk add --no-cache nginx
RUN corepack enable

WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile --filter @job/web...

ARG VITE_API_URL
RUN pnpm --filter @job/web build

# O nginx serve o resultado do build, com o index.html como página de entrada.
RUN cp -r apps/web/dist/. /usr/share/nginx/html/
COPY apps/web/nginx.conf /etc/nginx/http.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
