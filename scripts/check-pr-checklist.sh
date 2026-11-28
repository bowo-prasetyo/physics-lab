#!/usr/bin/env bash
# Checks the "## Testing" section of a pull-request description (in $BODY).
# Run by .github/workflows/pr-checklist.yml.
#
#   - [x] item                     done: passes
#   - [ ] item — Not done: reason  honestly not done: passes, shown as a warning
#   - [ ] item                     fails: tick it once done, or say why not
#   - [x] item (not run locally)   fails: a ticked box must mean it was done
#   a standard line deleted        fails: the template's four lines stay, ticked or explained
set -euo pipefail
# HTML comments (the template's instructions and examples) are not part of the checklist.
section=$(printf '%s\n' "${BODY:-}" | tr -d '\r' | perl -0pe 's/<!--.*?-->//gs' | awk '/^## Testing[[:space:]]*$/{found=1; next} /^## /{found=0} found')
if [ -z "$(printf '%s' "$section" | tr -d '[:space:]')" ]; then
  echo "::error::The description has no '## Testing' section. Fill in the pull-request template."
  exit 1
fi
boxes=$(printf '%s\n' "$section" | grep -E '^[[:space:]]*[-*] \[[ xX]\]' || true)
if [ -z "$boxes" ]; then
  echo "::error::The 'Testing' section has no checklist."
  exit 1
fi
status=0
# The template's four standard lines must stay: a step may be explained as not done, never dropped.
for required in 'npm test' 'audit:localization' 'npm run build' 'browser'; do
  if ! printf '%s\n' "$boxes" | grep -qiF -- "$required"; then
    echo "::error::The Testing checklist is missing its '$required' line. Keep it: tick it, or leave it unticked with 'Not done: <reason>'."
    status=1
  fi
done
# A ticked box that says, in the same line, that the work did not happen.
contradiction='not (run|checked|tested|verified|done|executed)|unavailable|pending|skipped|will run|to be (run|checked)'
ticked_but_not_done=$(printf '%s\n' "$boxes" | grep -E '^[[:space:]]*[-*] \[[xX]\]' | grep -iE "$contradiction" || true)
if [ -n "$ticked_but_not_done" ]; then
  echo "::error::These boxes are ticked but say the work was not done. Untick them and write 'Not done: <reason>' instead:"
  printf '%s\n' "$ticked_but_not_done"
  status=1
fi
unticked=$(printf '%s\n' "$boxes" | grep -E '^[[:space:]]*[-*] \[ \]' || true)
unexplained=$(printf '%s\n' "$unticked" | grep -viE 'not done:[[:space:]]*[^[:space:]].{4,}' | sed '/^$/d' || true)
explained=$(printf '%s\n' "$unticked" | grep -iE 'not done:[[:space:]]*[^[:space:]].{4,}' || true)
if [ -n "$unexplained" ]; then
  echo "::error::Tick each box once it is done, or leave it unticked with 'Not done: <reason>':"
  printf '%s\n' "$unexplained"
  status=1
fi
if [ -n "$explained" ]; then
  while IFS= read -r line; do echo "::warning::Not done (decide before merging): $line"; done <<< "$explained"
fi
[ "$status" -eq 0 ] && echo "Testing checklist complete."
exit "$status"
