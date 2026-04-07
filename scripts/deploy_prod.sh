#!/bin/bash

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use Node v20
nvm use v20 || { echo "Failed to switch to Node v20"; exit 1; }

echo "🚀 Starting deployment..."
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Update code
git fetch origin || { echo "Git fetch failed"; exit 1; }
git reset --hard origin/main || { echo "Git reset failed"; exit 1; }
git pull origin main || { echo "Git pull failed"; exit 1; }

# Install dependencies
echo "📦 Installing dependencies..."
npm install || { echo "npm install failed"; exit 1; }

# Build
echo "🏗️ Building application..."
rm -rf dist/
npm run build || { echo "Build failed"; exit 1; }

echo "✅ Deployment completed successfully. 🎉🎉🎉"
