#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm use v20

echo "🚀 Starting deployment..."

git fetch origin
git reset --hard origin/main
git pull origin main

npm install

echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed! Deployment aborted."
  exit 1
fi

echo "Deployment completed successfully. 🎉🎉🎉"
