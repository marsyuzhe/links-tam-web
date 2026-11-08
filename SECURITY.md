# Security policy

Do not publish secrets or private resume/proof files in an issue. Report a vulnerability privately to the maintainer through the contact method on the website or GitHub profile; there is no invented security mailbox or response-time guarantee.

FULL_NODE rejects protected access when runtime private configuration is absent. Provision `private/resume/official.pdf` and `access.private.json` separately. Rotate the session secret after disclosure. PAGES_PUBLIC has no protected PDF, credential configuration or API. See [private resume security](docs/PRIVATE_RESUME_SECURITY.md).

The in-process resume attempt limit is intended for one Node instance. Multiple instances require a reviewed shared limiter. HTTPS and trusted reverse-proxy configuration are required for public production. Do not publish local browser profiles or authenticated traces.
