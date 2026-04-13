#!/bin/bash
set -euo pipefail

DEPLOY_DIR="/home/talenteedio/website/frontend"
DIST_BACKUP="/home/talenteedio/website/frontend_dist_backup"
PREVIOUS_COMMIT_FILE="/tmp/talenteed_frontend_previous_commit"

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use v20 || true

cd "$DEPLOY_DIR"

echo "⏪ Starting frontend rollback..."
echo "   Date : $(date)"
echo "   Current commit: $(git rev-parse --short HEAD)"

# ── Stratégie 1 : restaurer le dist sauvegardé (rapide, zéro rebuild) ────
if [ -d "$DIST_BACKUP" ]; then
  echo ""
  echo "⚡ Fast rollback — restoring dist backup..."
  rm -rf dist/
  cp -r "$DIST_BACKUP" dist
  echo "   dist restored from backup"
fi

# ── Rollback du code ──────────────────────────────────────────────────────
if [ -f "$PREVIOUS_COMMIT_FILE" ]; then
  PREVIOUS_COMMIT=$(cat "$PREVIOUS_COMMIT_FILE")
else
  echo "   No rollback target found — using HEAD~1"
  PREVIOUS_COMMIT=$(git rev-parse HEAD~1)
fi

echo ""
echo "   Rolling back code to: $PREVIOUS_COMMIT"
git reset --hard "$PREVIOUS_COMMIT" \
  || { echo "❌ Git reset failed during rollback"; exit 1; }
echo "   Code rolled back to: $(git rev-parse --short HEAD)"

# ── Si pas de backup dist, rebuilder depuis l'ancien commit ───────────────
if [ ! -d "$DIST_BACKUP" ]; then
  echo ""
  echo "🏗️  No dist backup — rebuilding from previous commit..."
  npm install || { echo "❌ npm install failed during rollback"; exit 1; }
  rm -rf dist/
  npm run build || { echo "❌ Build failed during rollback"; exit 1; }
fi

echo ""
echo "✅ Rollback completed. Running on commit: $(git rev-parse --short HEAD)"
