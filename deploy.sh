#!/usr/bin/env bash
set -euo pipefail

STAMP=$(date +%Y-%m-%d-%H%M%S)
OUTDIR=~/builds/$STAMP
SITE=/var/www/dougk.musicsian.com

echo "▶ npm ci"
npm ci

echo "▶ npm run build"
npm run build
mv dist "$OUTDIR"

echo "▶ copy into releases"
sudo mkdir -p "$SITE/releases"
sudo rsync -az --delete "$OUTDIR"/ "$SITE/releases/$STAMP/"

echo "▶ fix selinux context"
sudo restorecon -Rv "$SITE/releases/$STAMP"

echo "▶ flip current symlink"
sudo rm -rf "$SITE/current"
sudo ln -s "$SITE/releases/$STAMP" "$SITE/current"

echo "▶ reload nginx"
sudo systemctl reload nginx

echo "✓ Deployed dougk $STAMP"
