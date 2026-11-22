// Check the built Hugo site in public/ (or $SITE_OUTPUT). Run `npm run build` first.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { before, test } from "node:test";
import { Parser } from "htmlparser2";

const repo = path.resolve(import.meta.dirname, "..");
const root = path.resolve(repo, process.env.SITE_OUTPUT ?? "public");

const walk = (dir) =>
  fs
    .readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) =>
      path
        .relative(dir, path.join(entry.parentPath, entry.name))
        .split(path.sep)
        .join("/"),
    );

const sameBytes = (a, b) => fs.readFileSync(a).equals(fs.readFileSync(b));

function parsePage(file) {
  const page = {
    source: fs.readFileSync(file, "utf8"),
    links: [],
    canonical: undefined,
    discovery: {},
    refresh: undefined,
    postLinks: [],
  };
  const parser = new Parser({
    onopentag(tag, attrs) {
      if (tag === "link") {
        if (attrs.rel === "canonical") page.canonical = attrs.href;
        else if (
          ["site.standard.document", "site.standard.publication"].includes(
            attrs.rel,
          )
        )
          page.discovery[attrs.rel] = attrs.href;
      }
      if (tag === "meta" && attrs["http-equiv"]?.toLowerCase() === "refresh")
        page.refresh = attrs.content;
      if (tag === "a" && (attrs.class ?? "").split(/\s+/).includes("post-link"))
        page.postLinks.push(attrs.href);
      for (const key of ["href", "src"])
        if (key in attrs) page.links.push(attrs[key]);
      if ("srcset" in attrs)
        for (const candidate of attrs.srcset.split(","))
          page.links.push(candidate.trim().split(/\s+/)[0]);
    },
  });
  parser.end(page.source);
  return page;
}

// Collect text of matching elements from an XML document.
function xmlTexts(file, tag) {
  const texts = [];
  let current;
  const parser = new Parser(
    {
      onopentag(name) {
        if (name === tag) current = "";
      },
      ontext(text) {
        if (current !== undefined) current += text;
      },
      onclosetag(name) {
        if (name === tag) {
          texts.push(current);
          current = undefined;
        }
      },
    },
    { xmlMode: true },
  );
  parser.end(fs.readFileSync(file, "utf8"));
  return texts;
}

let pages, home, origin, posts, aliases;

const outputFile = (url) => {
  const { pathname } = new URL(url, origin);
  const target = decodeURIComponent(pathname).replace(/^\//, "");
  return pathname.endsWith("/") || !path.extname(target)
    ? path.posix.join(target, "index.html")
    : target;
};

before(() => {
  assert.ok(
    fs.existsSync(path.join(root, "index.html")),
    "Run npm run build first.",
  );
  pages = new Map(
    walk(root)
      .filter((name) => name.endsWith(".html"))
      .map((name) => [name, parsePage(path.join(root, name))]),
  );
  home = pages.get("index.html");
  origin = new URL(home.canonical).origin;

  // Expected posts and aliases from front matter; Hugo validates the rest.
  posts = new Map();
  aliases = new Map();
  const postsDir = path.join(repo, "content/posts");
  for (const entry of fs.readdirSync(postsDir, { withFileTypes: true })) {
    const source = path.join(postsDir, entry.name, "index.md");
    if (!entry.isDirectory() || !fs.existsSync(source)) continue;
    const front = fs.readFileSync(source, "utf8").split("---", 3)[1];
    const field = (name) =>
      front
        .match(new RegExp(`^${name}: (.+)$`, "m"))?.[1]
        .replace(/^["']|["']$/g, "");
    assert.equal(
      field("url"),
      undefined,
      `${source}: posts use permalinks, not url`,
    );
    if (field("draft") === "true" || Date.parse(field("date")) > Date.now())
      continue;
    const permalink = `/posts/${entry.name}/`;
    posts.set(permalink, { name: entry.name, atUri: field("atUri") });
    const list = front.match(/^aliases:\n((?: {2}- .+\n)+)/m)?.[1] ?? "";
    for (const [, alias] of list.matchAll(/^ {2}- (.+)$/gm))
      aliases.set(
        alias.replace(/^["']|["']$/g, "").replace(/^\//, ""),
        permalink,
      );
  }
});

test("published files are clean", () => {
  const files = walk(root);
  assert.deepEqual(
    files.filter((name) => /(^|\/)(\.DS_Store|\.gitkeep)$/.test(name)),
    [],
    "Finder metadata or repository placeholders were published.",
  );
  const rejected = [...pages].filter(([, page]) =>
    page.source.includes("ZgotmplZ"),
  );
  assert.deepEqual(
    rejected.map(([name]) => name),
    [],
    "Template URLs were rejected.",
  );
});

test("CNAME, .well-known, and shared assets are unchanged", () => {
  assert.ok(
    sameBytes(path.join(root, "CNAME"), path.join(repo, "CNAME")),
    "CNAME changed.",
  );
  for (const dir of [".well-known", "assets/images"]) {
    for (const name of walk(path.join(repo, dir))) {
      if (/(^|\/)(\.DS_Store|\.gitkeep)$/.test(name)) continue;
      const file = path.posix.join(dir, name);
      assert.ok(sameBytes(path.join(root, file), path.join(repo, file)), file);
    }
  }
  const publication = fs
    .readFileSync(
      path.join(root, ".well-known/site.standard.publication"),
      "utf8",
    )
    .trim();
  assert.equal(
    publication,
    home.discovery["site.standard.publication"],
    "Publication verification file is wrong.",
  );
});

test("internal links resolve", () => {
  const failures = [];
  for (const [name, page] of pages) {
    for (const link of page.links) {
      let url;
      try {
        // Resolve relative links against the page, as a browser would.
        url = new URL(link, new URL(name, origin + "/"));
      } catch {
        continue;
      }
      if (!["http:", "https:"].includes(url.protocol) || url.origin !== origin)
        continue;
      if (!fs.existsSync(path.join(root, outputFile(url.href))))
        failures.push(`${name}: missing target ${link}`);
    }
  }
  assert.deepEqual(failures, []);
});

test("pagination lists every post once", () => {
  const all = [...home.postLinks];
  assert.equal(home.postLinks.length, Math.min(10, posts.size));
  for (let number = 2; number <= Math.ceil(posts.size / 10); number++) {
    const page = pages.get(`page/${number}/index.html`);
    assert.ok(page, `Missing page ${number}`);
    assert.equal(
      page.postLinks.length,
      Math.min(10, posts.size - 10 * (number - 1)),
    );
    all.push(...page.postLinks);
  }
  assert.deepEqual([...all].sort(), [...posts.keys()].sort());
});

test("posts have AT Protocol discovery links", () => {
  for (const [permalink, { atUri }] of posts) {
    const page = pages.get(outputFile(permalink));
    assert.ok(page, `Missing post ${permalink}`);
    if (atUri)
      assert.equal(page.discovery["site.standard.document"], atUri, permalink);
    assert.match(
      page.discovery["site.standard.publication"] ?? "",
      /^at:\/\//,
      permalink,
    );
  }
});

test("bundle resources are published with their posts", () => {
  for (const { name } of posts.values()) {
    const bundle = path.join(repo, "content/posts", name);
    for (const resource of fs.readdirSync(bundle)) {
      if (resource === "index.md" || resource === ".DS_Store") continue;
      const published = path.join(root, "posts", name, resource);
      assert.ok(
        fs.existsSync(published) &&
          sameBytes(published, path.join(bundle, resource)),
        published,
      );
    }
  }
});

test("legacy URLs redirect to their posts", () => {
  // URLs published by Jekyll, its redirect_from pages, and Sequoia records.
  const legacy = fs
    .readFileSync(
      path.join(import.meta.dirname, "fixtures/legacy-urls.txt"),
      "utf8",
    )
    .split("\n")
    .filter(Boolean);
  for (const url of legacy)
    assert.ok(
      aliases.has(url.replace(/^\//, "")),
      `Missing legacy alias: ${url}`,
    );
  for (const [alias, permalink] of aliases) {
    const page = pages.get(alias);
    assert.ok(page?.refresh, `Missing redirect: ${alias}`);
    assert.ok(
      page.refresh.endsWith(origin + permalink),
      `Wrong redirect: ${alias}`,
    );
  }
});

test("Atom feed has the latest posts", () => {
  const feed = path.join(root, "feed.xml");
  assert.equal(xmlTexts(feed, "entry").length, 10, "Expected 10 entries.");
  assert.ok(
    xmlTexts(feed, "content")[0]?.includes("<"),
    "Feed content is double-escaped.",
  );
});

test("sitemap lists every post", () => {
  const locations = new Set(xmlTexts(path.join(root, "sitemap.xml"), "loc"));
  for (const permalink of posts.keys())
    assert.ok(
      locations.has(origin + permalink),
      `Post missing from sitemap: ${permalink}`,
    );
});
