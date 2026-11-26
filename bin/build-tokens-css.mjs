// Builds tokens.css from the design system's tokens.json.
//
// Usage: npm run tokens -- <tokens.json> [tokens.css]
// The output defaults to themes/minima/assets/css/tokens.css.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const DEFAULT_OUT = fileURLToPath(
  new URL("../themes/minima/assets/css/tokens.css", import.meta.url),
);

const comment = (tok) =>
  tok.usage ? ` /* ${tok.usage.replaceAll("*/", "* /")} */` : "";

// Split a themed family (color, shadow) into first-theme values and per-theme overrides.
function themed(family, themes) {
  const [first, ...rest] = themes;
  const base = [];
  const overrides = Object.fromEntries(rest.map((t) => [t, []]));
  for (const tok of family.tokens ?? []) {
    const val = tok.value;
    if (typeof val === "string") {
      base.push(`  --${tok.name}: ${val};${comment(tok)}`);
      continue;
    }
    base.push(
      `  --${tok.name}: ${val[first] || Object.values(val)[0]};${comment(tok)}`,
    );
    for (const t of rest) {
      if (t in val) overrides[t].push(`  --${tok.name}: ${val[t]};`);
    }
  }
  return { base, overrides };
}

export function build(t) {
  const themes = (t.color?.themes ?? []).map((th) => th.id);
  if (!themes.length) themes.push("light");
  const out = [
    `/* ${t.name ?? "Design system"} — generated from tokens.json */`,
  ];

  const base = [];
  const overrides = Object.fromEntries(themes.slice(1).map((th) => [th, []]));
  for (const fam of ["color", "shadow"]) {
    if (!t[fam]) continue;
    const r = themed(t[fam], themes);
    base.push(...r.base);
    for (const [th, lines] of Object.entries(r.overrides)) {
      overrides[th].push(...lines);
    }
  }
  out.push(`:root, [data-theme="${themes[0]}"] {`, ...base, "}");
  for (const [th, lines] of Object.entries(overrides)) {
    if (lines.length) out.push(`[data-theme="${th}"] {`, ...lines, "}");
  }

  const root = [];
  const skip = new Set(["name", "version", "color", "shadow", "type", "meta"]);
  for (const [fam, body] of Object.entries(t)) {
    if (skip.has(fam) || !body || typeof body !== "object") continue;
    for (const tok of body.tokens ?? []) {
      root.push(`  --${tok.name}: ${tok.value};${comment(tok)}`);
    }
  }
  const typ = t.type ?? {};
  for (const [key, stack] of Object.entries(typ.families ?? {})) {
    root.push(`  --font-${key}: ${stack};`);
  }
  const styles = [];
  for (const group of typ.groups ?? []) {
    for (const s of group.styles ?? []) {
      const fam = s.family ?? group.family ?? "sans";
      const weight = s.fontWeight ?? 400;
      const lineHeight = s.lineHeight ?? "normal";
      root.push(
        `  --text-${s.name}: ${weight} ${s.fontSize}/${lineHeight} var(--font-${fam});${comment(s)}`,
      );
      styles.push(
        `.${s.name} {`,
        `  font-family: var(--font-${fam});`,
        `  font-size: ${s.fontSize};`,
        `  line-height: ${lineHeight};`,
        `  font-weight: ${weight};`,
        `  letter-spacing: ${s.letterSpacing ?? 0};`,
        "}",
      );
    }
  }
  out.push(":root {", ...root, "}", ...styles);

  for (const font of typ.fonts ?? []) {
    const path = font.file.includes("/") ? font.file : `fonts/${font.file}`;
    out.push(
      "@font-face {",
      `  font-family: "${font.family}";`,
      `  src: url("${path}");`,
      `  font-weight: ${font.weight ?? "400"};`,
      `  font-style: ${font.style ?? "normal"};`,
      "  font-display: swap;",
      "}",
    );
  }

  return out.join("\n") + "\n";
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [src, dst = DEFAULT_OUT] = process.argv.slice(2);
  if (!src) {
    console.error("Usage: npm run tokens -- <tokens.json> [tokens.css]");
    process.exit(1);
  }
  writeFileSync(dst, build(JSON.parse(readFileSync(src, "utf8"))));
  console.log(`Wrote ${dst}`);
}
