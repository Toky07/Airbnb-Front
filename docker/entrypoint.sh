#!/bin/sh
set -e

SYNC_SCRIPT="${SYNC_SCRIPT:-/sync-node-modules.sh}"
if [ -f "$SYNC_SCRIPT" ]; then
  # shellcheck disable=SC1090
  . "$SYNC_SCRIPT"
else
  sync_node_modules() { :; }
fi

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
