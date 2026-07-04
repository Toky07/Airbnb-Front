#!/bin/sh
set -e

case "${ENVIRONMENT:-prod}" in
  dev|development)
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
