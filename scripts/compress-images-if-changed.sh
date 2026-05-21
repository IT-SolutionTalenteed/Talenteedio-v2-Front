#!/bin/bash
# Compresse public/images/ uniquement si des fichiers image ont changé entre deux commits.
# Usage : compress-images-if-changed.sh <commit_avant> <commit_après>
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

FROM="${1:-}"
TO="${2:-HEAD}"

if [ -z "$FROM" ]; then
  echo "⏭️  Commit de référence manquant — compression ignorée."
  exit 0
fi

CHANGED="$(git diff --name-only "$FROM" "$TO" -- public/images/ 2>/dev/null \
  | grep -E '\.(png|jpe?g)$' || true)"

if [ -z "$CHANGED" ]; then
  echo "⏭️  Aucune image modifiée dans public/images/ — compression ignorée."
  exit 0
fi

echo "🖼️  Images modifiées détectées :"
echo "$CHANGED" | sed 's/^/   /'
npm run compress:images
