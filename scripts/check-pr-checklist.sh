#!/usr/bin/env bash
# Fails unless the pull-request description (in $BODY) has a "## Testing"
# section whose boxes are all ticked. Run by .github/workflows/pr-checklist.yml.
set -euo pipefail
section=$(printf '%s\n' "${BODY:-}" | tr -d '\r' | awk '/^## Testing[[:space:]]*$/{found=1; next} /^## /{found=0} found')
if [ -z "$(printf '%s' "$section" | tr -d '[:space:]')" ]; then
  echo "::error::The description has no '## Testing' section. Fill in the pull-request template."
  exit 1
fi
unticked=$(printf '%s\n' "$section" | grep -E '^[[:space:]]*[-*] \[ \]' || true)
if [ -n "$unticked" ]; then
  echo "::error::Tick every box under 'Testing' once it is done (say what you could not check):"
  printf '%s\n' "$unticked"
  exit 1
fi
if ! printf '%s\n' "$section" | grep -qE '^[[:space:]]*[-*] \[[xX]\]'; then
  echo "::error::The 'Testing' section has no ticked boxes."
  exit 1
fi
echo "Testing checklist complete."
