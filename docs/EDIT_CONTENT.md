# Editing the portfolio

- Profile/bio/SEO: src/content/profile.ts. Four experiences, dates, duties and sources: src/content/experiences.ts. Confirmed honours only: src/content/recognitions.ts.
- Project archive: src/content/projects.ts. Keep featured true on only 4–6 records; link exists only for real case pages. Child modules, forks and concepts must keep their own stage/ownership. Update the archive count assertions if intentionally changing the record count.
- Media: keep public repository originals immutable outside public, pin to a commit, register SHA256 and true dimensions in content/media-manifest.json. Optimizer: scripts/optimize-refresh-media.mjs. Never use an artwork as a screenshot.
- Work proofs: source -> ignored private/proofs/source; review -> private/proofs/derived. Preserve hashes and deterministic processing log. User must review publication separately. Never use AI to redraw evidence. Do not add a private path to a client import or public static folder.
- Update PDF: build/start the local site, run node scripts/export-resume.mjs, render every PDF page with pdftoppm and inspect it. Check /cv phone and native desktop preview, and compare downloaded file hash to the generated file. The generated PDF is public/assets/Links-Tam-Resume.pdf; never replace it with a private source resume.
- npm run build / npm run typecheck / npm run lint. Browser suites: node scripts/content-motion-qa.mjs and node scripts/content-qa.mjs; local production server must be available on 127.0.0.1:3006.
- Source packaging uses scripts/package-content-refresh.py with a strict allowlist; proofs, reports, references, specs and credentials are excluded. No deploy or push without user review.
