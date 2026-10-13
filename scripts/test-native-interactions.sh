#!/usr/bin/env bash

set -euo pipefail

platform=$1
report_directory=$2
scope=${VISUAL_COMPONENTS:-*}
flow=$(mktemp ./native-interaction-flow.XXXXXX.yaml)

mkdir -p "$report_directory"
trap 'rm -f -- "$flow"' EXIT

pnpm --dir apps/native-storybook exec node scripts/generate-interaction-flow.mjs \
  "$platform" "$scope" > "$flow"
maestro test \
  --format junit \
  --output "$report_directory/report.xml" \
  --test-output-dir "$report_directory/artifacts" \
  "$flow"
