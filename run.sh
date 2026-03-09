#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$ROOT_DIR"

if [ ! -d node_modules ]; then
  echo "node_modules not found. Installing dependencies..."
  npm install
fi

echo "Starting Vocabulary Loop at http://localhost:5173"
npm run dev -- --host 0.0.0.0
