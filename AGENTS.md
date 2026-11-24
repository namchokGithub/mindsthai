# MindsThai

## Library conventions

- Use strict TypeScript, small modules, and pure functions where practical.
- Keep runtime code independent of frameworks and Node-specific APIs; never make runtime network requests.
- Keep public APIs stable and expose only intentional root and subpath exports.
- Cover non-visual behavior with focused tests and independently reviewable Thai fixtures.
- Document linguistic assumptions, fallbacks, supported cases, and limitations. Do not claim full RTGS or invent readings for unknown text.

## Testing and verification

- **Writing tests:** Add automated tests for domain, application, repository,
  persistence, security-rule, migration, and other non-visual logic. Do not
  create or update automated tests for UI-only work (visual styling, layout,
  presentation components, or page appearance).
- **Running checks:** You may run only the test files you added or changed,
  for example `node --test tests/<name>.test.ts`. Do not run `pnpm lint`,
  `pnpm build`, `pnpm test:sql` (the full suite), or other build commands
  unless the user explicitly requests it.
- **Browser:** The user verifies browser flows, mobile navigation, and
  light/dark themes manually. Start the dev server or use browser automation
  only when the user asks for it.
- Report which checks were and were not run. Do not claim a browser-only flow
  (editors, downloads, clipboard, persistence, responsive navigation, themes)
  is verified without exercising it in a browser.

## Decisions

Ask the user before deciding anything that affects:

- scope (adding, removing, or deferring requested work);
- user-visible behavior, UX, copy, or tool naming;
- data formats, persistence keys, routes, or tool IDs;
- new dependencies or runtime resources;
- privacy, security, or CSP.

For implementation details inside those boundaries (internal names, file
layout, helper structure), follow existing patterns in the codebase without
asking.

## Git and releases

- Do not create commits or tags unless the user explicitly requests it.
- Never run `git push` (branches, tags, or `--force`) or create a GitHub
  Release. Prepare the commit or tag locally, then hand the user the exact
  push/release command to run.
- Never add AI/agent attribution to commits, tags, pull requests, or release
  notes (for example `Co-Authored-By: Claude …` or "Generated with …"). GitHub
  counts co-author trailers as repository contributors, and a pushed trailer
  cannot be removed without rewriting history.

## After code changes

Report:

- what changed and the important files touched;
- which checks were and were not run;
- remaining concerns or follow-up work;
- a suggested commit message.

Commit message rules:

1. Base it on staged changes (`git diff --cached`) if any exist; otherwise on
   `git diff`. Never mix the two.
2. Use Conventional Commits: `<type>(<scope>): <summary>`, with a scope when
   one is identifiable (for example `sql`, `images`, `remove-background`).
3. Include Jira keys after the scope if they appear in the diff.
4. Keep the subject at 100 characters or fewer and focus on user or business
   impact, not syntax noise. Ignore whitespace-only changes.

Example:

```
fix(remove-background): reset mounted flag on mount so results are not dropped under StrictMode
```
