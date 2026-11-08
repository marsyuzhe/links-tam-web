// Independent build-time rollback. Both enhancements are enabled unless explicitly set to 0.
// The user reverted the Hero to original icon links; the 3D dock is not mounted.
export const ENABLE_INTERACTIVE_DOCK = false;
export const ENABLE_MEMORY_KEYS = process.env.NEXT_PUBLIC_ENABLE_MEMORY_KEYS !== '0';

export const ENABLE_PERSONAL_PORTRAIT = false;

// Home atmosphere is independent of the optional About portrait.
export const ENABLE_IDENTITY_ATMOSPHERE = true;
