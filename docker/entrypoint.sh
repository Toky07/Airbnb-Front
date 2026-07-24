#!/bin/sh
set -e

sync_node_modules() {
  lock_sha=$(sha256sum package-lock.json | awk '{print $1}')
  marker=node_modules/.package-lock.sha

  if [ ! -d node_modules ] || [ ! -f "$marker" ] || [ "$(cat "$marker")" != "$lock_sha" ]; then
    echo "→ Synchronisation des dépendances npm (package-lock.json modifié ou volume obsolète)..."
    npm ci
    echo "$lock_sha" > "$marker"
  fi
}

case "${ENVIRONMENT:-prod}" in
  dev|development)
    sync_node_modules
    exec npm run dev -- --host 0.0.0.0 --port "${PORT:-5173}"
    ;;
  prod|production)
    exec nginx -g "daemon off;"
    ;;
  *)
    echo "ENVIRONMENT must be 'dev' or 'prod' (got: ${ENVIRONMENT})" >&2
    exit 1
    ;;
esac
