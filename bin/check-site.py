#!/usr/bin/env python3
"""Check Hugo output contracts; optionally compare a Jekyll migration baseline."""

import argparse
from datetime import datetime
from html.parser import HTMLParser
from pathlib import Path
import re
from urllib.parse import unquote, urlparse
import xml.etree.ElementTree as ET


class Page(HTMLParser):
    def __init__(self, file):
        super().__init__(convert_charrefs=True)
        self.links = []
        self.ids = set()
        self.canonical = None
        self.discovery = {}
        self.refresh = None
        self.post_links = []
        self.headings = set()
        self.source = file.read_text()
        self.feed(self.source)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.add(attrs["id"])
            if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
                self.headings.add(attrs["id"])
        if tag == "link":
            rel, href = attrs.get("rel"), attrs.get("href")
            if rel == "canonical":
                self.canonical = href
            elif rel in ("site.standard.document", "site.standard.publication"):
                self.discovery[rel] = href
        if tag == "meta" and attrs.get("http-equiv", "").lower() == "refresh":
            self.refresh = attrs.get("content")
        if tag == "a" and "post-link" in attrs.get("class", "").split():
            self.post_links.append(attrs.get("href"))
        for key in ("href", "src", "srcset"):
            if key in attrs:
                self.links.extend((value.strip().split()[0] for value in attrs[key].split(",")) if key == "srcset" else [attrs[key]])


def output_file(root, url):
    parsed = urlparse(url)
    target = root / unquote(parsed.path).lstrip("/")
    return target / "index.html" if parsed.path.endswith("/") or not target.suffix else target


def check(root, baseline=None):
    assert (root / "index.html").is_file(), "Run npm run build first."
    assert not list(root.rglob(".DS_Store")), "Finder metadata was published."
    assert not list(root.rglob(".gitkeep")), "Repository placeholders were published."
    assert (root / "CNAME").read_bytes() == Path("CNAME").read_bytes(), "Custom domain configuration changed."
    pages = {file.relative_to(root).as_posix(): Page(file) for file in root.rglob("*.html")}
    assert pages, "No generated pages."
    home = pages["index.html"]
    host = urlparse(home.canonical).netloc
    failures = []
    for name, page in pages.items():
        if "ZgotmplZ" in page.source:
            failures.append(f"{name}: template URL was rejected")
        for link in page.links:
            parsed = urlparse(link)
            if parsed.scheme not in ("", "http", "https") or (parsed.netloc and parsed.netloc != host):
                continue
            if not parsed.path.startswith("/"):
                continue
            target = output_file(root, link)
            if not target.is_file():
                failures.append(f"{name}: missing target {link}")
    assert not failures, "\n".join(failures)
    expected_posts = {}
    for source in Path("content/posts").glob("*.md"):
        if source.name == "_index.md":
            continue
        front = source.read_text().split("---", 2)[1]
        def field(name):
            match = re.search(rf"^{name}: (.+)$", front, re.MULTILINE)
            return match[1].strip("\"'") if match else None
        date = datetime.fromisoformat(field("date"))
        if field("draft") == "true" or date > datetime.now(date.tzinfo):
            continue
        expected_posts[field("url")] = field("atUri")
    assert len(home.post_links) == min(10, len(expected_posts))
    all_posts = list(home.post_links)
    for number in range(2, (len(expected_posts) + 9) // 10 + 1):
        page = pages[f"page/{number}/index.html"]
        assert len(page.post_links) == min(10, len(expected_posts) - 10 * (number - 1))
        all_posts.extend(page.post_links)
    assert set(all_posts) == set(expected_posts), "Missing or duplicated paginated posts."
    assert len(all_posts) == len(expected_posts), "Duplicated paginated posts."
    for post in all_posts:
        page = pages[output_file(root, post).relative_to(root).as_posix()]
        if expected_posts[post]:
            assert page.discovery.get("site.standard.document") == expected_posts[post], post
        assert page.discovery.get("site.standard.publication", "").startswith("at://"), post
    for file in Path(".well-known").rglob("*"):
        if file.is_file() and file.name != ".gitkeep":
            assert (root / file).read_bytes() == file.read_bytes(), file
    for file in Path("assets/images").rglob("*"):
        if file.is_file() and file.name != ".DS_Store":
            assert (root / file).read_bytes() == file.read_bytes(), file
    for alias in (
        "tips/2022/11/08/on-mastodon.html",
        "sport/2026/08/16/i-m-a-masochist-on-zwift.html",
    ):
        assert pages[alias].refresh, f"Missing redirect: {alias}"
    ns = {"a": "http://www.w3.org/2005/Atom"}
    feed = ET.parse(root / "feed.xml")
    entries = feed.findall("a:entry", ns)
    assert len(entries) == 10
    assert "<" in entries[0].findtext("a:content", namespaces=ns), "Feed content is double-escaped."
    sitemap = ET.parse(root / "sitemap.xml")
    locations = {node.text for node in sitemap.iter("{http://www.sitemaps.org/schemas/sitemap/0.9}loc")}
    for post in all_posts:
        assert home.canonical.rstrip("/") + post in locations, f"Post missing from sitemap: {post}"
    if baseline:
        for file in baseline.rglob("*.html"):
            relative = file.relative_to(baseline).as_posix()
            if relative.startswith(("page2/", "page3/", "page4/")):
                continue
            assert relative in pages, f"Lost legacy URL: {relative}"
            old, new = Page(file), pages[relative]
            assert old.discovery == new.discovery, f"Discovery links changed: {relative}"
            missing = old.headings - new.headings
            assert not missing, f"Heading anchors changed in {relative}: {missing}"
        old_feed = ET.parse(baseline / "feed.xml")
        assert [entry.findtext("a:id", namespaces=ns) for entry in entries] == [
            entry.findtext("a:id", namespaces=ns) for entry in old_feed.findall("a:entry", ns)
        ], "Atom entry IDs changed."
    print(f"Checked {len(pages)} HTML pages, {len(all_posts)} posts, Atom feed, sitemap, redirects, assets, and discovery files.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=Path("public"))
    parser.add_argument("--baseline", type=Path)
    args = parser.parse_args()
    check(args.output, args.baseline)
