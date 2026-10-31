# AI SATELLITE — STANDARDIZED API ARCHITECTURE & REFERENCE
## UNIFORM RESPONSES, TRACING HEADERS & VALIDATION PROTOCOLS

**Permanent Canonical Domain:** `https://aisatellite.dev`  
**Base Protocol:** HTTPS / JSON REST  
**Authentication Scheme:** Cookie (`__Secure-aisatellite-session`) or Header (`Authorization: Bearer <token>`)

---

### 1. UNIFORM RESPONSE ENVELOPE

Every API endpoint across AI Satellite returns a consistent JSON envelope defined in `src/lib/ecosystem/api-response.ts`:

#### Success Response
```json
{
  "success": true,
  "data": {
    "resourceId": "res_signoz",
    "name": "SigNoz",
    "status": "verified"
  },
  "meta": {
    "timestamp": "2026-10-31T17:00:00.000Z",
    "traceId": "trc_4f8a12e9b0c3d4e5",
    "page": 1,
    "total": 42
  }
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Authenticated user lacks the required permission: manage:system",
    "details": {
      "requiredPermission": "manage:system",
      "userRole": "registered_user"
    }
  },
  "meta": {
    "timestamp": "2026-10-31T17:00:00.000Z",
    "traceId": "trc_9a7b6c5d4e3f2a1b"
  }
}
```

---

### 2. STANDARD ERROR CODES

| Error Code | HTTP Status | Description |
|---|:---:|---|
| `UNAUTHENTICATED` | 401 | Missing, malformed, or expired session token. |
| `FORBIDDEN` | 403 | User lacks required role permission (or IDOR violation). |
| `NOT_FOUND` | 404 | Target resource, route, or entity does not exist. |
| `VALIDATION_FAILED`| 422 | Input payload failed Zod schema parsing. |
| `RATE_LIMITED` | 429 | Request frequency exceeded client quota limit. |
| `COST_BUDGET_EXCEEDED` | 429 | Autonomous AI agent daily budget cap reached. |
| `INTERNAL_ERROR` | 500 | Unhandled exception; trace ID logged to audit ledger. |

---

### 3. REQUEST TRACING PROTOCOL

All API requests and responses carry a distributed tracing ID:
- Header: `x-satellite-trace: trc_<16-hex-characters>`
- All backend logs, event bus entries, and database audit records correlate against this trace identifier.
