# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS deps
WORKDIR /app
ENV npm_config_update_notifier=false
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update \
    && apt-get install -y --no-install-recommends dumb-init
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

FROM deps AS build
ARG VITE_API_URL=http://localhost:3000
ARG VITE_APP_NAME=Airbnb
ARG VITE_STRIPE_PUBLISHABLE_KEY=
ARG VITE_ADMIN_PUBLIC_URL=http://localhost:5174
ENV VITE_API_URL=$VITE_API_URL \
    VITE_APP_NAME=$VITE_APP_NAME \
    VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY \
    VITE_ADMIN_PUBLIC_URL=$VITE_ADMIN_PUBLIC_URL
COPY . .
RUN npm run build

# ---------------------------------------------------------------------------
# Development — hot reload (bind-mounts provide source)
# ---------------------------------------------------------------------------
FROM deps AS development
ENV ENVIRONMENT=dev \
    NODE_ENV=development \
    PORT=5173
COPY docker/entrypoint.sh /entrypoint.sh
COPY --from=scripts sync-node-modules.sh /sync-node-modules.sh
RUN chmod +x /entrypoint.sh /sync-node-modules.sh
EXPOSE 5173
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:5173/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
ENTRYPOINT ["dumb-init", "--", "/entrypoint.sh"]

# ---------------------------------------------------------------------------
# Production — assets statiques servis par nginx (non-root, port 8080)
# ---------------------------------------------------------------------------
FROM nginx:1.27-alpine AS production
ENV ENVIRONMENT=prod
RUN sed -i '/^user /d' /etc/nginx/nginx.conf \
  && sed -i 's|pid .*;|pid /tmp/nginx.pid;|' /etc/nginx/nginx.conf \
  && mkdir -p /var/cache/nginx /tmp \
  && chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx /tmp
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
RUN chown -R nginx:nginx /usr/share/nginx/html /etc/nginx/conf.d
USER nginx
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/ > /dev/null || exit 1
