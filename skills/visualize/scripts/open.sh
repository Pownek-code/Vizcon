#!/usr/bin/env bash
# Open a file in the default browser, on macOS, Linux, WSL or Windows (Git Bash). No-op when headless.
f="$1"; [ -z "$f" ] && { echo "usage: open.sh <file.html>"; exit 2; }
case "$(uname -s)" in
  Darwin) open "$f" ;;
  Linux)
    if grep -qi microsoft /proc/version 2>/dev/null && command -v wslview >/dev/null; then wslview "$f"
    elif [ -n "$DISPLAY$WAYLAND_DISPLAY" ] && command -v xdg-open >/dev/null; then xdg-open "$f" >/dev/null 2>&1 &
    else echo "No display here — open this file yourself: $f"; fi ;;
  MINGW*|MSYS*|CYGWIN*) start "" "$f" ;;
  *) echo "Open this file in your browser: $f" ;;
esac
