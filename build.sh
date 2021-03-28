#!/bin/bash
set -euo pipefail
IFS=$' \n\t'
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

echo "running python"
python3 create_page.py

echo "copying:"
echo "...images"
cp -r -u resources/images out_int
echo "...bootstrap"
cp -r -u vendor/bootstrap-5.0.0-beta2-dist out_int/.

echo "compiling typescript"
tsc --build typescript/tsconfig.json

echo "inlining webpage"
if [ ! -d out ]; then
    mkdir out
fi
inliner out_int/index.html >out/index.html
echo "all done, enjoy"
