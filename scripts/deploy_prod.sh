#!/bin/bash

set -e  # Exit on any error

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

nvm use v20

echo "🚀 Starting deployment..."
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

git fetch origin
git reset --hard origin/main
git pull origin main

echo "📦 Installing dependencies..."
npm install

echo "🏗️ Building application..."
npm run build

echo "✅ Deployment completed successfully. 🎉🎉🎉"
