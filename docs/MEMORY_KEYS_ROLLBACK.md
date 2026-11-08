# Independent rollback

## Memory Keys

Set NEXT_PUBLIC_ENABLE_MEMORY_KEYS=0, stop the owned local server, run npm run build then npm start. The About slot renders the original ExperienceList compact and heading, without changing Hero, Projects, Skills or Resume. Remove the env value (or set1), rebuild to restore Memory Keys. This is a build-time flag, not an on-page switch; the default is enabled.

## Hero

Latest user instruction reverted the proposed 3D Dock. No Dock is mounted and ENABLE_INTERACTIVE_DOCK is fixed false. Hero currently uses ordinary outlined icons, labels and the original Magnetic wrapper. To revert even the corrected icon/label edit, selectively restore src/components/portfolio/Hero.tsx from before-memory-keys.zip; do not overwrite the entire project or private evidence. The unused Dock proposal is not an active feature toggle.

## Full scoped recovery

Use baseline-manifest.json and before-memory-keys.zip in a separate extraction folder. Restore only reviewed changed files. Package/lock snapshot allows dependency rollback. Do not git reset/clean: the initial checkout already had extensive user content changes. No deployments or pushes were made.
