#!/bin/bash

# Script pour synchroniser les pages statiques depuis le dossier static/ vers public/static/

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
STATIC_SOURCE="$PROJECT_ROOT/../static"
STATIC_DEST="$PROJECT_ROOT/public/static"

echo "🔄 Synchronisation des pages statiques..."
echo "Source: $STATIC_SOURCE"
echo "Destination: $STATIC_DEST"

# Créer le dossier de destination s'il n'existe pas
mkdir -p "$STATIC_DEST"

# Copier les fichiers HTML
echo "📄 Copie des fichiers HTML..."
cp -v "$STATIC_SOURCE"/*.html "$STATIC_DEST/"

# Copier les assets
echo "🎨 Copie des assets..."
cp -rv "$STATIC_SOURCE/assets" "$STATIC_DEST/"

# Mettre à jour les chemins dans les fichiers HTML
echo "🔧 Mise à jour des chemins des assets..."
for file in "$STATIC_DEST"/*.html; do
    if [ -f "$file" ]; then
        # Remplacer les chemins relatifs par des chemins absolus
        sed -i 's|href="assets/|href="/static/assets/|g' "$file"
        sed -i 's|src="assets/|src="/static/assets/|g' "$file"
        
        # Supprimer les attributs width/height des logos pour permettre le CSS de gérer la taille
        sed -i 's/<img src="\/static\/assets\/logo\.png" alt="Talenteed" width="[0-9]*" height="[0-9]*">/<img src="\/static\/assets\/logo.png" alt="Talenteed">/g' "$file"
        sed -i 's/<img src="\/static\/assets\/logo\.png" alt="Talenteed" width="[0-9]*">/<img src="\/static\/assets\/logo.png" alt="Talenteed">/g' "$file"
        
        # Ajouter le fichier fixes.css si pas déjà présent
        if ! grep -q "fixes.css" "$file"; then
            sed -i 's|</head>|  <link rel="stylesheet" href="/static/assets/css/fixes.css">\n</head>|' "$file"
        fi
        
        echo "  ✓ $(basename "$file")"
    fi
done

echo "✅ Synchronisation terminée !"
echo ""
echo "Pages disponibles :"
echo "  - /static/corporate"
echo "  - /static/company"
echo "  - /static/entreprises"
echo "  - /static/talent"
echo "  - /static/talent-landing"
echo "  - /static/talent-confirm"
echo "  - /static/matching"
echo "  - /static/comment-ca-marche"
echo "  - /static/jobs"
echo "  - /static/talents"
echo "  - /static/corporate-landing"
