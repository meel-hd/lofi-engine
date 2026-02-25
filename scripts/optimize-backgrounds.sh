#!/usr/bin/env bash
# optimize-backgrounds.sh
# Converts public/assets/background/bg*.jpg → .webp
# Requires: cwebp  (apt install webp  /  brew install webp)
#       or: ffmpeg (apt install ffmpeg /  brew install ffmpeg)
#
# Usage:
#   chmod +x scripts/optimize-backgrounds.sh
#   ./scripts/optimize-backgrounds.sh
#
# Output files are written next to the originals.
# Original JPEGs are kept; delete them manually once you've verified the WebP files.

set -euo pipefail

INPUT_DIR="public/assets/background"
QUALITY=82          # 0–100  (82 is a sweet spot: ~70 % smaller than JPEG at 90)
MAX_WIDTH=1920       # resize if wider than this

if [[ ! -d "$INPUT_DIR" ]]; then
  echo "    Directory not found: $INPUT_DIR"
  echo "    Run this script from the project root."
  exit 1
fi

# ── Pick conversion tool ──────────────────────────────────────────────────────
if command -v cwebp &>/dev/null; then
  TOOL="cwebp"
elif command -v ffmpeg &>/dev/null; then
  TOOL="ffmpeg"
else
  echo "    Neither cwebp nor ffmpeg found."
  echo "    Install one of them and re-run:"
  echo "      apt install webp   (or brew install webp)"
  echo "      apt install ffmpeg (or brew install ffmpeg)"
  exit 1
fi

echo "ℹ    Using: $TOOL"
echo "ℹ    Source: $INPUT_DIR"
echo ""

CONVERTED=0
SKIPPED=0
TOTAL_BEFORE=0
TOTAL_AFTER=0

for jpg in "$INPUT_DIR"/bg*.jpg "$INPUT_DIR"/bg*.jpeg; do
  [[ -f "$jpg" ]] || continue

  webp="${jpg%.*}.webp"
  size_before=$(stat -c%s "$jpg" 2>/dev/null || stat -f%z "$jpg")
  TOTAL_BEFORE=$((TOTAL_BEFORE + size_before))

  if [[ "$TOOL" == "cwebp" ]]; then
    cwebp -q "$QUALITY" -resize "$MAX_WIDTH" 0 "$jpg" -o "$webp" -quiet
  else
    # ffmpeg: scale down only if wider than MAX_WIDTH, preserve aspect ratio
    ffmpeg -y -i "$jpg" \
      -vf "scale='min($MAX_WIDTH,iw)':-1" \
      -c:v libwebp -quality "$QUALITY" \
      "$webp" -loglevel error
  fi

  size_after=$(stat -c%s "$webp" 2>/dev/null || stat -f%z "$webp")
  TOTAL_AFTER=$((TOTAL_AFTER + size_after))
  saving=$(( (size_before - size_after) * 100 / size_before ))

  printf "      %-30s  %5s KB → %5s KB  (-%d%%)\n" \
    "$(basename "$jpg")" \
    "$((size_before / 1024))" \
    "$((size_after  / 1024))" \
    "$saving"

  CONVERTED=$((CONVERTED + 1))
done

if [[ $CONVERTED -eq 0 ]]; then
  echo "    No bg*.jpg files found in $INPUT_DIR"
  exit 0
fi

echo ""
echo "─────────────────────────────────────────────────────────"
printf "  Total  %d KB → %d KB  (-%d%% overall)\n" \
  "$((TOTAL_BEFORE / 1024))" \
  "$((TOTAL_AFTER  / 1024))" \
  "$(( (TOTAL_BEFORE - TOTAL_AFTER) * 100 / TOTAL_BEFORE ))"
echo ""
echo "  Converted : $CONVERTED file(s)"
echo "  Skipped   : $SKIPPED file(s)"
echo ""
echo "      Original JPEGs have been kept."
echo "      Once you've verified the WebP files, you can remove them:"
echo "      rm $INPUT_DIR/bg*.jpg"
