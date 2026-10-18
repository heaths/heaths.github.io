---
name: migrate
description: Migrate a Jekyll site to Hugo while preserving its published URLs, theme, customizations, and integrations.
argument-hint: Jekyll source directory (defaults to the current repository)
agent: agent
---

Migrate the Jekyll site in the migration source directory to Hugo. Implement the migration, not just a plan. Use the current repository as the source unless another directory is provided. Investigate the actual site rather than assuming it resembles a particular previous migration.

## Requirements and boundaries

- Use YAML for Hugo site and theme configuration, normally `hugo.yaml` and `themes/<theme-name>/hugo.yaml`. Preserve existing data formats unless conversion is necessary.
- Preserve published post, ordinary page, collection, archive, redirect, and discovery URLs, including everything under `.well-known/`. Preserve heading anchors used by existing links.
- Pagination URLs may change to Hugo's native routes. Preserve the pagination's appearance, controls, accessibility, and navigation behavior as closely as possible.
- Preserve the site's content, theme, customizations, author data, metadata, feeds, assets, and interactive features. Do not replace the design with an unrelated Hugo theme.
- Prefer Hugo's built-in functionality over custom replacements wherever it can satisfy these requirements.
- Keep existing skills and their support scripts; adapt them to Hugo where necessary. Do not introduce unrelated developer tooling.
- Only migrate Sequoia configuration or state if `sequoia.json` exists in the migration source directory.
- Only spell-check, lint Markdown, or run Prettier when the source repository already has the corresponding skill or support files, as described below.
- Do not stage, commit, publish to AT Protocol, deploy, or modify remote settings without explicit authorization. A migration request does not authorize those actions.
- Preserve unrelated working-tree changes. Do not overwrite another site's output, delete broad directories, or modify existing published identifiers.

## 1. Discover the site and record its baseline

Read repository instructions and inspect the working tree before editing. Identify:

- Jekyll configuration and environment overrides; dependency manifests and lockfiles; theme gems, remote themes, and pinned theme versions.
- Posts, pages, collections, front matter defaults, categories, tags, dates, time zones, permalink rules, redirects, and unpublished content.
- Local layouts, includes, plugins, Sass, JavaScript, images, data sources, and static files, including dotfiles, `CNAME`, and `.well-known/`.
- SEO metadata, canonical URLs, author information, feeds and their formats, sitemap, robots rules, search, theme switching, embeds, and external integrations.
- Development commands, deployment workflows, hosting settings, editor configuration, post-creation helpers, and existing quality tools.

Read relevant pages linked from <https://gohugo.io/documentation/>, especially configuration, content management, templates, functions, modules, Sass processing, and hosting. Check the installed Hugo version and its supported configuration and template APIs. Use authoritative documentation instead of assuming old examples still apply.

Capture a production Jekyll build before removing Jekyll dependencies. Store the baseline outside tracked source files and outside the future Hugo output directory. Use the production domain and production settings, not a stale localhost build. If a build is blocked, investigate existing output and document its provenance and limitations; do not claim full parity without a reliable baseline.

Inventory actual generated URLs and representative rendered pages. Record post counts, publication order, pagination, feed identifiers, aliases, heading IDs, discovery links, assets, and important UI behavior. Do not derive the compatibility contract solely from filenames or assumed permalink rules.

The importer at <https://gohugo.io/commands/hugo_import_jekyll/> can be used as a starting point, but it is not sufficient evidence of a complete migration. Manually handle anything it misses.

## 2. Build a combined local Hugo theme

Determine the theme actually used by the source site. Fetch missing upstream files from its pinned gem version, tag, commit, or release. Prefer the locked version over the latest release. If multiple theme components are used, identify their composition and precedence.

Create a repository-local theme under `themes/<theme-name>/`. Choose its name from the source theme or an appropriate existing project convention; do not assume the theme is Minima.

- Combine upstream defaults with local overrides, preserving the original override precedence.
- Retain upstream licenses and attribution, and document the exact provenance and version.
- Port necessary Liquid layouts and includes to Hugo Go templates, partials, render hooks, and shortcodes.
- Place theme-owned styles, scripts, icons, and other assets inside the local theme. Keep site-owned content, images, data, and generated integration modules in appropriate site directories.
- Preserve layout, typography, responsive behavior, colors, dark/light themes, syntax highlighting, social controls, search, subscription UI, and other existing interactions.
- Use the template lookup conventions supported by the selected Hugo version. Do not copy obsolete directory conventions without checking them.

Compile Sass through Hugo's asset pipeline. Use Dart Sass when required by the existing styles, including modern Sass modules such as `sass:color`; do not assume LibSass is compatible. Preserve import order, variable overrides, CSS output paths, and production compression behavior.

Verify the actual standalone `sass` executable on `PATH`. A Ruby version-manager shim can stop working after removing `.ruby-version`; resolve that rather than treating Hugo's subprocess error as a stylesheet problem. Document required tools and provide equivalent CI setup.

## 3. Migrate configuration, content, and data

Use native Hugo configuration and features for menus, pagination, sections, taxonomies, front matter, Markdown, aliases, outputs, sitemap, and robots generation wherever compatible.

- Move posts, pages, and collections into Hugo's content model. Preserve source metadata and collection-specific behavior.
- Preserve each published URL with native permalink rules or explicit `url` front matter. Use explicit overrides for exceptions. Keep redirects as Hugo aliases when they match the required behavior.
- Preserve absolute and relative links, including links between source Markdown files. Use native page references or a render hook when appropriate; fail visibly on unresolved references.
- Preserve dates, publication ordering, and displayed local dates. Check posts near midnight and mixed timestamp formats against the baseline. If normalizing timestamps, preserve the represented instant and intended published path.
- Convert legacy `modified_date` front matter to Hugo's native `lastmod`, preserving its value. Update templates and remove obsolete references; do not add `modified_date` to a configuration field whose schema rejects it.
- Preserve intended published/modified date display. Do not display a modification date merely because Hugo defaults `.Lastmod` to `.Date`.
- Preserve existing summaries and excerpt boundaries, using Hugo's `<!--more-->` support where applicable. Follow the source repository's requirements rather than imposing a new summary policy on historical posts.
- Port Liquid-only tags, `post_url`, raw blocks, image attributes, and custom plugins to native Hugo syntax, render hooks, or minimal shortcodes. Keep literal template examples and code blocks literal.
- Preserve raw HTML where the existing content depends on it. Match heading ID generation and footnotes where needed to retain anchors and rendering.
- Move author and other data files into Hugo's data directories and update their consumers. Use the supported Hugo data API.

Use native `.Paginate` for pagination. Port the existing navigation markup and styling around Hugo's paginator, including previous/next, first/last, current-page state, and sliding page windows where present.

Preserve the existing feed format and public feed path. If the source uses Atom, do not silently replace it with Hugo's default RSS format. Preserve feed entry IDs, canonical URLs, content escaping, and item count policy so subscribers do not see old entries as new.

Preserve canonical, Open Graph, Twitter, structured-data, and author metadata. Use Go template escaping deliberately: custom URI schemes such as `at://` may need `safeURL` after validating their source. Check output for rejected URLs such as `#ZgotmplZ`.

Mount or copy only intended public assets. Preserve `CNAME` and `.well-known/` payloads byte-for-byte where applicable. Ensure Hugo publishes required hidden discovery files without exposing source files, dependency manifests, tools, `.DS_Store`, `.gitkeep`, or private state. Verify mount filter syntax against the installed Hugo version and use a fresh temporary output directory to distinguish exclusions from stale output.

Do not enable public taxonomy or section listing URLs merely because Hugo creates them by default; match the original site's intended public surfaces.

## 4. Conditionally migrate Sequoia

Perform this entire section only if `sequoia.json` exists in the migration source directory. Otherwise, do not add Sequoia files, dependencies, configuration, or migration instructions.

Inspect the installed Sequoia version, local configuration, and CLI help without logging in or publishing. Preserve existing publication and document identities.

- Update content, output, image, and public directory settings to match the migrated site.
- Make Sequoia resolve exactly the same post URLs as Hugo. Prefer a shared explicit `url` front matter field if the installed Sequoia version supports it; otherwise use a supported mapping and verify all exceptions.
- Exclude Hugo section metadata such as `_index.md` from post discovery when necessary.
- Keep integration modules, discovery attributes, callbacks, and UI components wired to their existing public paths.
- Never change existing `atUri` values, publication URIs, record references, CIDs, publication timestamps, or slugs merely because files moved.
- If `.sequoia-state.json` exists, remap its post-path keys to the actual new paths. Validate that every remapped file exists and no entries were lost or collided. Preserve all entry values, including `contentHash` and `bskyPostRef`.

Do not recompute saved content hashes just to make the state match the migrated files. They describe the last published content; replacing them before publishing could suppress required updates.

If the user needs remote documents updated, provide commands from the installed version's help rather than executing them. For a version supporting these flags, explain `publish --force --dry-run` followed by `publish --force`, using the repository's actual CLI wrapper. Confirm whether existing front matter URIs select updates rather than new records and whether successful publication refreshes stored hashes.

Check Bluesky announcement behavior before advising a forced publication. Warn that entries without saved announcement references may generate announcements, and explain how the user can disable Bluesky posting for document-only updates. Do not change this setting or publish without authorization.

## 5. Update build, deployment, and authoring support

- Replace the Jekyll build/deployment workflow with Hugo while retaining the hosting destination and domain.
- Install reproducible Hugo and Sass versions in CI, select a supported runtime for existing helper tools, and use checksums where available. Follow repository rules for pinning actions by commit SHA.
- Build the correct production output and upload required hidden files. Do not trigger deployment as part of validation.
- Update build scripts, development-server commands and ports, ignore files, editor settings, dependency automation, and documentation.
- Preserve existing post-creation helpers and their CLI behavior. Adapt paths, configuration access, front matter, date handling, category confirmation, and URL generation. If removing Ruby dependencies would break a required helper, port it to an appropriate existing runtime.
- Add focused tests for changed helper behavior, including invalid input, duplicate protection, stable URLs, and required metadata. Complete interactive confirmations before reading the body to EOF.
- Retain skills and their support files, updating references from Jekyll to Hugo. Existing `package.json` files may support both skills and needed migration tooling; do not remove them as obsolete Jekyll artifacts.
- Remove obsolete Jekyll configuration, templates, plugins, and dependencies only after their functionality has been accounted for and the replacement works.

## 6. Apply only existing quality tooling

Determine eligibility from the migration source repository before introducing tooling. A corresponding repository skill or support file qualifies: for example, a spelling skill/configuration/script, a Markdown lint skill/configuration/dependency, or a Prettier skill/configuration/script. A globally available tool alone is not a reason to introduce it.

Plan these checks now, but do not execute them until all migration edits, documentation, and functional verification in section 7 are complete. Reserve them for one final quality pass, not intermediate checkpoints. For eligible checks only, follow existing instructions and run them in this order:

1. Spell-check changed source files. Preserve valid technical identifiers with existing scoped dictionary conventions. Ask before changing historical prose or code typos unless already authorized.
2. Run existing general lint checks and, if available, Markdown lint on changed Markdown.
3. Format changed files with the existing Prettier setup last, after all other edits. Use a compatible Go-template parser for migrated templates if Prettier is already part of the source workflow. Honor generated-file and third-party exclusions.

Do not add spelling dictionaries, Markdown lint configurations, or Prettier dependencies solely to enable a check that was absent from the source site. If an existing eligible skill requires temporary tooling, follow that skill without adding unrelated permanent dependencies.

Include newly created and moved files, not just tracked modifications. Avoid scanning generated output, opaque machine state, lockfiles, or unchanged vendored sources as prose. Use existing package managers and commands; install or restore dependencies only when needed.

Reuse successful results already known from the session when the relevant files have not changed. Do not rerun spelling, Markdown lint, or Prettier just because the user requests staging or committing. If a final-pass fix changes a file, repeat only the affected check on that file, not the entire pass.

Check formatter output as well as its exit status. Go-template formatters may fail on dynamic HTML tag names or introduce whitespace inside conditional attribute values. Use equivalent, safely escaped template expressions rather than broadly disabling formatting or accepting broken metadata.

## 7. Verify the migration and finish

Build Hugo with production settings and explicit warnings enabled where supported. Fix unresolved references, template errors, Sass failures, duplicate target paths, and unexpected warnings.

Compare generated output against the production baseline:

- Every required post, page, collection, archive, redirect, and discovery URL still exists. Pagination is the permitted URL exception.
- Counts, publication dates and order, paginator page sizes, navigation targets, heading anchors, internal links, image URLs, and required assets match.
- Feed format, entry IDs, escaping, content, and item policy remain compatible; sitemap and robots output retain intended behavior.
- Metadata, canonical URLs, author data, modified dates, custom-scheme links, and integration attributes render correctly.
- `.well-known/`, domain configuration, and unchanged binary assets retain their payloads.
- Representative layouts, code blocks, tables, embeds, styling, responsive behavior, and interactive controls remain equivalent. Distinguish harmless minifier differences from meaningful rendering changes.

Use focused regression checks based on the discovered site rather than hard-coded counts, aliases, theme names, or domain names from another repository. Preserve intended code text and make prose changes only when authorized.

Smoke-test local serving when feasible, using an available port. Verify representative pages and compiled CSS return successful responses, then stop the specific temporary server. Do not leave a background process running unless requested. Finish functional verification with a production build so local-server settings do not remain in the final output, then run the final quality pass described in section 6. If a quality fix requires functional verification again, rerun only the affected verification without repeating unrelated quality checks.

Keep reproducible, directly relevant checks in the repository when appropriate; keep temporary baseline artifacts outside tracked source and clean up only known temporary files. Inspect the final diff, confirm no unrelated changes were lost, and leave everything unstaged and uncommitted unless instructed otherwise.

Report the migration result, important compatibility decisions, and any verified limitations. Clearly distinguish local completion from remote deployment or publication, and provide required user-run commands only when applicable.
