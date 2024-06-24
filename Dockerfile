# Base node image:
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
# Installing dependencies:
WORKDIR /app
ENV NODE_ENV production
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,sharing=locked,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
USER node
# Running the application:
CMD ["node", "index.js"]
