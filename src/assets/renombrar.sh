#!/usr/bin/env bash
set -euo pipefail

i=1
for f in WhatsApp\ Image*.jpeg; do
  [ -e "$f" ] || continue
  nuevo="imagen${i}.jpeg"
  mv -n -- "$f" "$nuevo"
  i=$((i+1))
done


