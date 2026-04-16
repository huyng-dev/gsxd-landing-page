from __future__ import annotations

import argparse
import subprocess
import shutil
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parent
DIST_DIR = ROOT_DIR / "dist"


def resolve_npm_executable() -> str:
    npm_cmd = shutil.which("npm.cmd")
    if npm_cmd:
        return npm_cmd

    npm_executable = shutil.which("npm")
    if npm_executable:
        return npm_executable

    raise SystemExit("Unable to locate npm or npm.cmd on PATH")


def run_command(command: list[str], cwd: Path) -> None:
    print(f"Running: {' '.join(command)}")
    subprocess.run(command, cwd=cwd, check=True)


def collect_changed_files(repo_dir: Path) -> list[str]:
    result = subprocess.run(
        ["git", "status", "--porcelain"],
        cwd=repo_dir,
        check=True,
        capture_output=True,
        text=True,
    )

    changed_files: list[str] = []
    for raw_line in result.stdout.splitlines():
        if not raw_line:
            continue

        path = raw_line[3:]
        if " -> " in path:
            path = path.split(" -> ", 1)[1]

        changed_files.append(path)

    return changed_files


def build_commit_message(changed_files: list[str]) -> str:
    unique_files: list[str] = []
    seen: set[str] = set()

    for file_path in changed_files:
        if file_path in seen:
            continue
        seen.add(file_path)
        unique_files.append(file_path)

    if not unique_files:
        return "update"

    preview = ", ".join(unique_files[:3])
    if len(unique_files) > 3:
        preview = f"{preview}, ... (+{len(unique_files) - 3} more)"

    return f"update change of file {preview}"


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Build the site, commit the dist repo, and push the result."
    )
    parser.add_argument(
        "--message",
        help="Override the commit message used for the dist repository.",
    )
    args = parser.parse_args(argv)

    if not DIST_DIR.exists():
        raise SystemExit(f"Missing dist directory: {DIST_DIR}")

    if not (DIST_DIR / ".git").exists():
        raise SystemExit(f"dist is not a git repository: {DIST_DIR}")

    source_changes = collect_changed_files(ROOT_DIR)
    commit_message = args.message or build_commit_message(source_changes)
    npm_executable = resolve_npm_executable()

    run_command([npm_executable, "run", "build"], ROOT_DIR)

    dist_changes = collect_changed_files(DIST_DIR)
    if not dist_changes:
        print("No changes detected in dist; skipping commit and push.")
        return 0

    run_command(["git", "add", "."], DIST_DIR)
    run_command(["git", "commit", "-m", commit_message], DIST_DIR)
    run_command(["git", "push"], DIST_DIR)

    print("Production automation completed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
