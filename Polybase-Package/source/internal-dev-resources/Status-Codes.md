# Status code for Polybase

# SUCCESS

- **200 OK**: Operation succeeded; query executed or data returned.
- **201 Created**: New resource added (e.g., new database entry).
- **204 No Content**: Operation succeeded; no data to return (e.g., DELETE).

## CLIENT ERR

- **400 Bad Request**: Invalid input --check syntax, missing params, malformed JSON obj, etc
- **401 Unauthorized**: auth required; client creds missing/invalid.
- **403 Forbidden**: client has no permission to perform the operation.
- **404 Not Found**: resource not found (e.g., invalid query 'target' param).
- **405 Method Not Allowed**:  ethod not supported for this operation.
- **409 Conflict**: conflict in resource state (e.g., dupe entries, version mismatch).
- **422 Unprocessable Entity**: input valid but fails processing (e.g., validation rules, business logic).
- **429 Too Many Requests**: rate limit exceeded; too many ops in a short time.

## POLYBASE SYSTEM ERR

- **500 Internal Server Error**: general polybase error; unexpected condition.
- **502 Bad Gateway**: invalid response from upstream service (e.g., database connection issues).
- **503 Service Unavailable**: temporarily overloaded or under maintenance; try again later.
- **504 Gateway Timeout**: upstream service took too long to respond.
