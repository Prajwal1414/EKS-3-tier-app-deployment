#!/bin/sh
set -e

# Replace the placeholder with the actual environment variable value
/bin/sh -c "envsubst < /usr/share/nginx/html/assets/env.js.template > /usr/share/nginx/html/assets/env.js"

# Execute the main container command (nginx)
exec "$@"
