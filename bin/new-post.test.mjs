import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { test } from "node:test";
import YAML from "yaml";

const { run, slugify, validateDate } = createRequire(import.meta.url)(
  "./new-post",
);

test("new-post creates Hugo content with a stable URL and summary", async (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "hugo-new-post-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.writeFileSync(
    path.join(root, "hugo.yaml"),
    "params:\n  categories:\n    - general\n    - tips\n",
  );
  const options = { root, input: { isTTY: false }, output: { write() {} } };
  const args = [
    "--title",
    "I'm a Hugo user!",
    "--summary",
    "A summary.",
    "--date",
    "2026-01-01T23:30:00-08:00",
    "--category",
    "tips",
    "--tags",
    "git,tips",
    "--body",
    "Hello.",
  ];
  await run(args, options);
  const file = path.join(root, "content/posts/2026-01-01-im-a-hugo-user.md");
  const text = fs.readFileSync(file, "utf8");
  const metadata = YAML.parse(text.split("---")[1]);
  assert.equal(metadata.url, "/tips/2026/01/01/im-a-hugo-user.html");
  assert.equal(metadata.date, "2026-01-01T23:30:00-08:00");
  assert.equal(metadata.summary.trim(), "A summary.");
  assert.deepEqual(metadata.tags, ["git", "tips"]);
  assert.match(text, /summary: >/);
  await assert.rejects(run(args, options), /already exists/);
  await assert.rejects(run(["--title", "Title"], options), /Summary/);
  await assert.rejects(
    run([...args, "--body-file", "missing"], options),
    /either --body or --body-file/,
  );
  const newArgs = args.map((arg) =>
    arg === "I'm a Hugo user!" ? "Another post" : arg,
  );
  await assert.rejects(
    run([...newArgs, "--category", "new"], options),
    /not listed/,
  );
  await run([...newArgs, "--category", "new", "--force-category"], options);
  assert.deepEqual(
    YAML.parse(fs.readFileSync(path.join(root, "hugo.yaml"), "utf8")).params
      .categories,
    ["general", "new", "tips"],
  );
});

test("slug and date validation reject unusable input", () => {
  assert.equal(slugify("I'm writing C# & .NET"), "im-writing-c-net");
  assert.equal(slugify("Résumé"), "resume");
  for (const date of [
    "nonsense",
    "2026-02-30T00:00:00Z",
    "2026-01-01",
    "2026-01-01T24:00:00Z",
    "2026-01-01T25:00:00Z",
  ]) {
    assert.throws(() => validateDate(date), /Invalid RFC3339/);
  }
});
