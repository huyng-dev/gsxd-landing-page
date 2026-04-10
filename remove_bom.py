from __future__ import annotations

import argparse
import os
from pathlib import Path


UTF8_BOM = b"\xef\xbb\xbf"

# Tuned for this repo (static site with Vite/Tailwind/HTML partials).
DEFAULT_EXTENSIONS = {
    ".html",
    ".css",
    ".js",
    ".json",
    ".md",
    ".txt",
    ".svg",
    ".xml",
    ".yml",
    ".yaml",
    ".ts",
    ".tsx",
    ".jsx",
    ".vue",
    ".py",
}

DEFAULT_EXCLUDED_DIRS = {
    ".git",
    "node_modules",
    "dist",
    ".vscode",
    "__pycache__",
}


def iter_candidate_files(root: Path, extensions: set[str], excluded_dirs: set[str]):
    """Yield text-like files under root, skipping ignored directories."""
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in excluded_dirs]
        base = Path(dirpath)

        for name in filenames:
            file_path = base / name
            if file_path.suffix.lower() in extensions:
                yield file_path


def clean_utf8_bom(file_path: Path, dry_run: bool) -> bool:
    """Remove UTF-8 BOM if present. Return True when BOM is found."""
    try:
        content = file_path.read_bytes()
    except OSError as exc:
        print(f"[ERROR] Cannot read {file_path}: {exc}")
        return False

    if not content.startswith(UTF8_BOM):
        return False

    if dry_run:
        print(f"[FOUND] {file_path}")
        return True

    try:
        file_path.write_bytes(content[len(UTF8_BOM) :])
        print(f"[CLEANED] {file_path}")
        return True
    except OSError as exc:
        print(f"[ERROR] Cannot write {file_path}: {exc}")
        return False


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Scan this project and remove UTF-8 BOM from text files."
    )
    parser.add_argument(
        "--root",
        default=str(Path(__file__).resolve().parent),
        help="Project root to scan (default: folder containing this script).",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Only report files with BOM, do not modify files.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    root = Path(args.root).resolve()

    if not root.exists() or not root.is_dir():
        raise SystemExit(f"[ERROR] Invalid root path: {root}")

    print(f"[INFO] Scanning: {root}")
    print(f"[INFO] Mode: {'dry-run' if args.dry_run else 'clean'}")

    scanned = 0
    hits = 0
    for file_path in iter_candidate_files(
        root, DEFAULT_EXTENSIONS, DEFAULT_EXCLUDED_DIRS
    ):
        scanned += 1
        if clean_utf8_bom(file_path, args.dry_run):
            hits += 1

    print("-" * 40)
    print(f"[DONE] Scanned files: {scanned}")
    if args.dry_run:
        print(f"[DONE] Files with UTF-8 BOM: {hits}")
    else:
        print(f"[DONE] Cleaned files: {hits}")


if __name__ == "__main__":
    main()