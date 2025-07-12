FROM node:22-bullseye AS builder

RUN apt-get update && \
    apt-get install -y libvips-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./
COPY apps/ apps/
COPY packages/ packages/


WORKDIR /app/apps/api

RUN npm install -g pnpm

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/packages ./packages

RUN pnpm install --prod --shamefully-hoist
RUN pnpm rebuild sharp

RUN mkdir -p /app/uploads

CMD ["node", "dist/index.js"]