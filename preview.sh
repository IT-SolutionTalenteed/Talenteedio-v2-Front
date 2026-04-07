#!/bin/bash
# Script pour prévisualiser le build de production

echo "🚀 Démarrage du serveur de prévisualisation..."
echo "📂 Serveur disponible sur: http://localhost:8080"
echo "⏹️  Appuyez sur Ctrl+C pour arrêter"
echo ""

cd dist && python3 -m http.server 8080
