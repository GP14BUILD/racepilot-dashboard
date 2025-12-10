#!/bin/sh
# Create .env.production file with build-time variables
echo "VITE_API_URL=${VITE_API_URL:-https://racepilot-backend-production.up.railway.app}" > .env.production
echo "Created .env.production with VITE_API_URL=${VITE_API_URL}"
cat .env.production

# Run the build
npm run build
