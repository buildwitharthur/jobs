# Build a partir da raiz do repositório:
#   docker build -f apps/api/Dockerfile -t job-api .
FROM node:24-alpine

WORKDIR /app
RUN corepack enable

COPY . .
RUN pnpm install --frozen-lockfile --filter @job/api...

WORKDIR /app/apps/api
RUN pnpm build

# Depois do install e do build: com NODE_ENV=production antes, o pnpm não instalaria o
# TypeScript e o Prisma (devDependencies), que o build precisa.
ENV NODE_ENV=production

EXPOSE 3000
CMD ["pnpm", "start"]
