import html
import json
import sys
import xml.etree.ElementTree as ElementTree
from pathlib import Path, PurePosixPath
from zipfile import ZipFile

MAX_ARCHIVE_SIZE = 10 * 1024 * 1024
MAX_MESSAGE_LENGTH = 12000
EXPECTED_FILES = {
    "web": "web-results.json",
    "android": "report.xml",
    "ios": "report.xml",
}


def extract_file(archive_path: Path, expected_name: str) -> bytes:
    with ZipFile(archive_path) as archive:
        files = [entry for entry in archive.infolist() if not entry.is_dir()]

        if len(files) != 1:
            raise ValueError(f"Unexpected report archive: {archive_path}")

        entry = files[0]
        entry_path = PurePosixPath(entry.filename)

        if (
            entry.file_size > MAX_ARCHIVE_SIZE
            or entry_path.is_absolute()
            or ".." in entry_path.parts
            or entry_path.name != expected_name
        ):
            raise ValueError(f"Unexpected report entry: {entry.filename}")

        return archive.read(entry)


def web_failures(content: bytes) -> list[tuple[str, str]]:
    report = json.loads(content)
    failures = []

    def visit(suites: list[dict]) -> None:
        for suite in suites:
            visit(suite.get("suites", []))

            for spec in suite.get("specs", []):
                for test in spec.get("tests", []):
                    for result in test.get("results", []):
                        for error in result.get("errors", []):
                            title = " › ".join([*suite.get("titlePath", []), spec.get("title", "")])
                            failures.append((title, error.get("message", "Test failed")))

    visit(report.get("suites", []))

    return failures


def native_failures(content: bytes) -> list[tuple[str, str]]:
    root = ElementTree.fromstring(content)
    failures = []

    for test_case in root.iter("testcase"):
        for failure in test_case.findall("failure"):
            title = test_case.get("name", "Native interaction")
            message = failure.get("message") or failure.text or "Test failed"
            failures.append((title, message))

    return failures


def render_failure(title: str, message: str) -> str:
    return f"""<article>
      <h2>{html.escape(title)}</h2>
      <pre>{html.escape(message[:MAX_MESSAGE_LENGTH])}</pre>
    </article>"""


site_root = Path(sys.argv[1])
pr_number = sys.argv[2]
commit_sha = sys.argv[3]
reports = {}

for value in sys.argv[4:]:
    platform, archive = value.split("=", 1)

    if platform not in EXPECTED_FILES or platform in reports:
        raise ValueError(f"Unexpected report platform: {platform}")

    content = extract_file(Path(archive), EXPECTED_FILES[platform])
    reports[platform] = web_failures(content) if platform == "web" else native_failures(content)

if not reports:
    raise ValueError("No quality reports were provided.")

sections = []

for platform in ["web", "android", "ios"]:
    if platform not in reports:
        continue

    failures = reports[platform]
    cards = "".join(render_failure(title, message) for title, message in failures)

    if not cards:
        cards = "<p>No structured failure was available. Review the workflow log.</p>"

    sections.append(
        f'<section><h1>{html.escape(platform.title())}</h1>{cards}</section>'
    )

output_directory = site_root / "quality-reports" / f"pr-{pr_number}" / commit_sha
output_directory.mkdir(parents=True, exist_ok=True)
output_directory.joinpath("index.html").write_text(
    f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'">
    <title>Quality failures for PR #{html.escape(pr_number)}</title>
    <style>
      :root {{ color-scheme: light dark; font-family: system-ui, sans-serif; }}
      body {{ margin: 0 auto; max-width: 1100px; padding: 32px; background: Canvas; color: CanvasText; }}
      h1 {{ margin-top: 40px; font-size: 24px; text-transform: capitalize; }}
      article {{ margin: 16px 0; padding: 20px; border: 1px solid color-mix(in srgb, CanvasText 25%, transparent); border-radius: 12px; }}
      h2 {{ margin: 0 0 12px; font-size: 17px; }}
      pre {{ margin: 0; overflow: auto; white-space: pre-wrap; font: 13px/1.5 ui-monospace, monospace; }}
      @media (max-width: 600px) {{ body {{ padding: 16px; }} }}
    </style>
  </head>
  <body>
    <main>
      <h1>Quality failures for PR #{html.escape(pr_number)}</h1>
      <p>Commit {html.escape(commit_sha[:7])}</p>
      {''.join(sections)}
    </main>
  </body>
</html>""",
    encoding="utf-8",
)
