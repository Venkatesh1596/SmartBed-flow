# Observability
- All state mutations are written to the `AuditLog` table.
- Correlation IDs are supported.
- PII/PHI is explicitly barred from this operational system.
- WebSockets broadcast changes without leaking sensitive event notes.
