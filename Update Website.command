#!/bin/zsh

set -e

cd -- "$(dirname "$0")"

pause_before_closing() {
  echo
  read -r "?Press Return to close this window."
}

show_error() {
  echo
  echo "The website was not uploaded. Read the error above, then try again."
  pause_before_closing
}

trap show_error ZERR

echo "Preparing the photographs..."

if [[ ! -x ".venv/bin/python3" ]]; then
  python3 -m venv .venv
fi

if ! .venv/bin/python3 -c "from PIL import Image" 2>/dev/null; then
  echo "Preparing the image tools for the first time..."
  .venv/bin/python3 -m pip install -r requirements.txt
fi

.venv/bin/python3 scripts/build_gallery.py

echo "Checking for website changes..."
git add --all

if git diff --cached --quiet; then
  echo
  echo "Nothing new to upload. Your live website is already up to date."
  pause_before_closing
  exit 0
fi

git commit -m "Update website $(date '+%Y-%m-%d %H:%M')"

echo "Uploading to GitHub..."
git push

trap - ZERR
echo
echo "Done. GitHub is now publishing the updated website."
echo "You can check progress at:"
echo "https://github.com/jcxw/jcxw.github.io/actions"
pause_before_closing
