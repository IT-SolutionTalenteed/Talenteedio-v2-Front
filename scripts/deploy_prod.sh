#!/bin/bash
set -euo pipefail

DEPLOY_DIR="/home/talenteedio/website/frontend"
DIST_BACKUP="/home/talenteedio/website/frontend_dist_backup"

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm use v20 || { echo "❌ Failed to switch to Node v20"; exit 1; }

cd "$DEPLOY_DIR"

echo "🚀 Starting frontend deployment..."
echo "   Dir  : $DEPLOY_DIR"
echo "   Date : $(date)"
echo "   Node : $(node -v)"
echo "   NPM  : $(npm -v)"
echo "   Commit before: $(git rev-parse --short HEAD)"

# ── Sauvegarde du dist actuel pour rollback rapide ────────────────────────
if [ -d "dist" ]; then
  echo ""
  echo "💾 Backing up current dist..."
  rm -rf "$DIST_BACKUP"
  cp -r dist "$DIST_BACKUP"
  echo "   Backup saved to $DIST_BACKUP"
fi

# ── Sauvegarde du commit actuel ───────────────────────────────────────────
PREVIOUS_COMMIT=$(git rev-parse HEAD)
echo "$PREVIOUS_COMMIT" > /tmp/talenteed_frontend_previous_commit
echo "   Rollback target saved: $PREVIOUS_COMMIT"

# ── Mise à jour du code ───────────────────────────────────────────────────
echo ""
echo "📥 Pulling latest code..."
git fetch origin || { echo "❌ Git fetch failed"; exit 1; }
git reset --hard origin/main || { echo "❌ Git reset failed"; exit 1; }
echo "   Commit after : $(git rev-parse --short HEAD)"

# ── Dépendances ───────────────────────────────────────────────────────────
echo ""
echo "📦 Installing dependencies..."
npm install || { echo "❌ npm install failed"; exit 1; }

# ── Build ─────────────────────────────────────────────────────────────────
echo ""
echo "🏗️  Building application..."
rm -rf dist/
npm run build || {
  echo "❌ Build failed — restoring previous dist..."
  if [ -d "$DIST_BACKUP" ]; then
    cp -r "$DIST_BACKUP" dist
    echo "   Previous dist restored from backup"
  fi
  exit 1
}

echo ""
echo "✅ Frontend deployment completed successfully. 🎉"
echo "   Deployed commit: $(git rev-parse --short HEAD)"
