#!/usr/bin/env bash
set -euo pipefail

STAMP=$(date +%Y-%m-%d-%H%M%S)
OUTDIR=~/builds/$STAMP
SITE=/var/www/dougk.world

# Detect distro
if [ -f /etc/os-release ]; then
    . /etc/os-release
    DISTRO="${ID:-unknown}"
else
    DISTRO="unknown"
fi

echo "▶ Detected distro: $DISTRO"

# Ensure builds directory exists
mkdir -p ~/builds

echo "▶ npm ci"
npm ci

echo "▶ npm run build"
npm run build
mv dist "$OUTDIR"

echo "▶ copy into releases"
sudo mkdir -p "$SITE/releases"
sudo rsync -az --delete "$OUTDIR"/ "$SITE/releases/$STAMP/"

# SELinux context fix (Alma/RHEL/Fedora only)
case "$DISTRO" in
    almalinux|rhel|centos|fedora|rocky)
        echo "▶ fix selinux context"
        sudo restorecon -Rv "$SITE/releases/$STAMP"
        ;;
    arch|manjaro|endeavouros)
        echo "▶ skipping selinux (not used on $DISTRO)"
        ;;
    *)
        # Fallback: run restorecon if available
        if command -v restorecon &>/dev/null; then
            echo "▶ fix selinux context"
            sudo restorecon -Rv "$SITE/releases/$STAMP"
        fi
        ;;
esac

echo "▶ flip current symlink"
sudo rm -rf "$SITE/current"
sudo ln -s "$SITE/releases/$STAMP" "$SITE/current"

echo "▶ reload nginx"
sudo systemctl reload nginx

echo "✓ Deployed dougk $STAMP on $DISTRO"
