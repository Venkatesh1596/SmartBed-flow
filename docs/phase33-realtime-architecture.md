# Phase 33 - Real-Time Architecture

## Technology Selection: WebSockets
We selected WebSockets over Server-Sent Events (SSE) because although our primary immediate use case is server-to-client event broadcasting, the architecture demands bi-directional keep-alives and authenticated connection upgrades.

## Hybrid Approach
To ensure absolute stability, we adopted a **Hybrid REST + WebSockets** approach:
1. **REST APIs** handle all mutations, CRUD operations, and initial data fetching.
2. **WebSockets** exclusively transmit lightweight operational events (e.g. BED_STATUS_CHANGED).
3. The React frontend intercepts these socket events and performs targeted HTTP invalidations or localized state merging.

## Authentication
WebSocket connections pass the JWT via query parameters (/ws?token=...) during the handshake. The backend validates this token identically to HTTP requests (get_current_user_ws), safely closing the socket with status.WS_1008_POLICY_VIOLATION on failure.

## Disconnection & Reconnection
The useRealtime React hook uses exponential backoff to recover from drops. Crucially, if the backend drops the connection due to an expired JWT, the hook triggers the standard uth:unauthorized DOM event, securely halting all requests and forcing a logout.
