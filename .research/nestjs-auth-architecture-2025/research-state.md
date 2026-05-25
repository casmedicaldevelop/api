# Research State — NestJS Auth Architecture 2025/2026

## Classification
**Type:** architecture + technology-decision
**Output Format:** Formal Report (5-topic structure as requested)
**Depth:** standard

---

## Topic 1: httpOnly Cookie vs JSON Body for Refresh Tokens

### Claim 1.1 — OWASP mandates httpOnly for session tokens
- Statement: OWASP Session Management Cheat Sheet requires cookie-based session tokens to have the HttpOnly attribute set. "HttpOnly cookie attribute instructs web browsers not to allow scripts an ability to access cookies via DOM document.cookie object."
- URL: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- Tier: 1 (OWASP official)
- Confidence: HIGH
- Date: retrieved 2026-04-17

### Claim 1.2 — Most secure cookie configuration
- Statement: OWASP defines most secure config as: `Set-Cookie: __Host-SID=<token>; path=/; Secure; HttpOnly; SameSite=Strict`
- URL: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- Tier: 1
- Confidence: HIGH

### Claim 1.3 — httpOnly prevents XSS-based cookie theft but not all CSRF
- Statement: "HttpOnly does not block XSS or stop script execution. It only affects access to cookies, so other XSS impacts such as CSRF token theft may still be possible."
- URL: https://owasp.org/www-community/HttpOnly
- Tier: 1
- Confidence: HIGH

### Claim 1.4 — OWASP JWT cheat sheet recommends sessionStorage for access tokens, hardened httpOnly cookie for fingerprint
- Statement: Recommends storing access token in sessionStorage, browser sends it as Bearer header. Separately, a fingerprint (random string, SHA-256 hashed) is stored as httpOnly cookie to prevent XSS token replay.
- URL: https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html
- Tier: 1
- Confidence: HIGH
- Note: This is the "user binding" pattern, not directly about refresh tokens, but applicable by extension.

### Claim 1.5 — SameSite Lax is insufficient alone; Strict is more secure but impacts UX
- Statement: "Lax only blocks unsafe methods" — still permits cookies on GET requests. "SameSite is scoped to registrable domain, not origin" — shared subdomains remain vulnerable. SameSite cannot be sole CSRF defense.
- URL: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
- Tier: 1
- Confidence: HIGH

### Claim 1.6 — Auth.js stores refresh_token in encrypted JWT in httpOnly cookie
- Statement: "Auth.js libraries store the refresh_token in an encrypted JWT, in an HttpOnly cookie."
- URL: https://authjs.dev/guides/refresh-token-rotation
- Tier: 2 (major auth library)
- Confidence: HIGH

### Claim 1.7 — Lucia moved to session tokens in cookies over JWTs
- Statement: Lucia moved to cookie-based session tokens (not JWTs). "HttpOnly cookies can be used to completely forget about tokens on the client side." Cookies shared across tabs solve multi-tab refresh issues.
- URL: https://github.com/lucia-auth/lucia/discussions/112
- Tier: 2
- Confidence: MEDIUM (secondary source, discussion thread)

### Claim 1.8 — OWASP recommends cookies over Web Storage for session tokens
- Statement: "Web Storage APIs: standards do not require localStorage data to be encrypted-at-rest, meaning it may be possible to directly access this data from disk." Cookies preferred with proper attributes.
- URL: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- Tier: 1
- Confidence: HIGH

### CSRF Trade-off documented
- When refresh token is in httpOnly cookie: automatic cookie inclusion means CSRF is possible unless SameSite=Strict or a custom CSRF token (signed double-submit) is added.
- OWASP recommends Signed Double-Submit Cookie variant with HMAC and session binding when needed.
- URL: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html

---

## Topic 2: Refresh Token Rotation + Reuse Detection

### Claim 2.1 — Every refresh must issue new refresh token and invalidate old (OAuth 2.1 requirement)
- Statement: "OAuth 2.1 requires authorization servers to issue a new refresh token with each refresh operation and invalidate the previous token."
- URL: https://www.loginradius.com/blog/identity/secure-refresh-token-rotation
- Tier: 2
- Confidence: HIGH

### Claim 2.2 — Auth0 reuse detection: immediate family invalidation
- Statement: "As soon as the new pair is issued by Auth0, the refresh token used in the request is invalidated. If a previously-invalidated refresh token is subsequently presented, the system recognizes this as a replay attempt." Auth0 revokes entire token family on reuse detection.
- URL: https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation
- Tier: 1 (Auth0 docs)
- Confidence: HIGH

### Claim 2.3 — Token family invalidation definition
- Statement: "Token family invalidation means revoking the entire chain of related tokens. When reuse is detected, the system doesn't just reject the old token — it revokes all tokens descended from the compromised lineage, forcing complete re-authentication."
- URL: https://www.loginradius.com/blog/identity/secure-refresh-token-rotation
- Tier: 2
- Confidence: HIGH

### Claim 2.4 — NestJS implementation pattern: store hash, compare, rotate
- Statement: Store hashed refresh token (bcrypt). On refresh: validate JWT signature, compare token with stored hash (bcrypt.compare), if valid issue new token pair and update stored hash, if not throw UnauthorizedException.
- URL: https://syskool.com/refresh-tokens-and-token-rotation-in-nestjs-secure-jwt-authentication/
- Tier: 3 (community)
- Confidence: MEDIUM

### Claim 2.5 — Alternative: blacklist table (not hash on user row)
- Statement: Store complete refresh token strings in a blacklist table (AuthRefreshToken). On refresh: check if token exists in blacklist; if yes, throw UnauthorizedException. After successful refresh: add old token to blacklist, issue new pair. Cron job clears expired records.
- URL: https://dev.to/zenstok/how-to-implement-refresh-tokens-with-token-rotation-in-nestjs-1deg
- Tier: 3
- Confidence: MEDIUM

### Claim 2.6 — Grace period emerging pattern (March 2026)
- Statement: Open issue in better-auth (March 2026) proposes optional grace period for token rotation to handle legitimate concurrent requests without triggering false-positive replay detections.
- URL: https://github.com/better-auth/better-auth/issues/8512
- Tier: 3 (GitHub issue)
- Confidence: LOW (emerging, not standardized)

---

## Topic 3: NestJS 11 JWT Auth Module Structure

### Claim 3.1 — passport-local + passport-jwt remains official NestJS recommendation
- Statement: Official NestJS docs (docs.nestjs.com/security/authentication and /recipes/passport) describe LocalStrategy + JwtStrategy as standard pattern. @nestjs/passport wraps passport cleanly.
- URL: https://docs.nestjs.com/security/authentication
- Tier: 1 (official docs)
- Confidence: HIGH
- Note: WebFetch of the doc page returned only title (bot protection), but search confirms it as the current official docs URL.

### Claim 3.2 — LocalStrategy pattern
- Statement: Extend `PassportStrategy(Strategy)` from passport-local. Implement `validate(username, password)`. Configure `usernameField: 'email'` if needed. Throw UnauthorizedException if user not found. Apply `@UseGuards(AuthGuard('local'))` on login route.
- URL: https://blog.nashtechglobal.com/mastering-authentication-in-nest-js-with-passport-local-strategy/
- Tier: 3
- Confidence: MEDIUM

### Claim 3.3 — JwtStrategy pattern (dual-strategy for access + refresh)
- Statement: `AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt')` — extracts Bearer from header, uses JWT_ACCESS_SECRET. `RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh')` — uses `passReqToCallback: true` to also expose raw refresh token for hash comparison.
- URL: https://www.elvisduru.com/blog/nestjs-jwt-authentication-refresh-token
- Tier: 3
- Confidence: MEDIUM

### Claim 3.4 — AuthModule wiring
- Statement: AuthModule imports `PassportModule` and `JwtModule.register({})` (or `registerAsync` for env-based secrets). Provides LocalStrategy, AccessTokenStrategy, RefreshTokenStrategy. Exports JwtModule for use in other modules.
- URL: https://www.elvisduru.com/blog/nestjs-jwt-authentication-refresh-token
- Tier: 3
- Confidence: MEDIUM

### Claim 3.5 — Passport-free alternative with JwtService.verify() is viable for simpler cases
- Statement: NestJS-native guard using `JwtService.verify()` in `canActivate()` works without passport. Suitable for simple JWT-only auth. Passport recommended for OAuth, multiple strategies, or complex production systems.
- URL: https://trilon.io/blog/nestjs-authentication-without-passport
- Tier: 2 (Trilon = NestJS core team)
- Confidence: HIGH

### Claim 3.6 — Global guard + @Public() decorator pattern
- Statement: Register JwtAuthGuard globally; apply `@Public()` custom metadata decorator on routes that should bypass auth. Reflector reads metadata in guard's `canActivate`. Standard pattern documented in NestJS guides.
- URL: https://oneuptime.com/blog/post/2026-02-02-nestjs-guards-authorization/view
- Tier: 2
- Confidence: HIGH

---

## Topic 4: OTP Password Recovery via Email

### Claim 4.1 — OWASP requires cryptographically secure random generation and single-use
- Statement: "Generated using a cryptographically secure random number generator." "Linked to individual user in database." "Invalidated after they have been used." Must expire after appropriate duration.
- URL: https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html
- Tier: 1
- Confidence: HIGH

### Claim 4.2 — OWASP requires rate limiting on both request and validation phases
- Statement: "Implement protections against excessive automated submissions such as rate-limiting on a per-account basis, requiring CAPTCHA, or other controls." Also rate-limit token validation to prevent brute-force.
- URL: https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html
- Tier: 1
- Confidence: HIGH

### Claim 4.3 — OWASP: do not lock accounts on reset attempt; prevent user enumeration
- Statement: "Accounts should not be locked out in response to a forgotten password attack." Ensure consistent response times to prevent enumeration.
- URL: https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html
- Tier: 1
- Confidence: HIGH

### Claim 4.4 — SHA-256 is correct hash for OTP tokens (not bcrypt)
- Statement: "HMAC-SHA256's speed and deterministic nature make it ideal for generating and verifying OTPs." For short-lived random tokens, "using bcrypt is unnecessary since the preimage is long and random." SHA-256 is standard; bcrypt doesn't hurt but adds unnecessary latency for tokens.
- URL: https://medium.com/@rakshit.iitp/bcrypt-hmac-sha256-and-otp-security-how-it-all-fits-together-d77065fae2fe
- Tier: 3
- Confidence: MEDIUM

### Claim 4.4b — Laravel framework stores password reset tokens as SHA-256 hash (real-world evidence)
- Statement: Framework issue confirms: "email should include the random plaintext token, and the database stores a hash (sha256), such that DB compromise doesn't provide useful information about reset tokens."
- URL: https://github.com/laravel/framework/issues/18570
- Tier: 2
- Confidence: HIGH

### Claim 4.5 — Separate table recommended; store: hashed OTP, userId, expiresAt, used flag
- Statement: Implementation uses dedicated collection/table separate from user records. Schema: hashed OTP, user reference, expiresAt timestamp (5 min), used boolean flag.
- URL: https://medium.com/@ranakrunal.mscit21/otp-based-authentication-with-expiry-replay-protection-c2033be48f85
- Tier: 3
- Confidence: MEDIUM

### Claim 4.6 — TTL: 5–15 minutes; attempts: 3–5; backoff recommended
- Statement: NIST advises OTPs valid for no more than 10 minutes. Sources suggest 3–5 attempts. Exponential backoff: 30s → 1min → 5min after failures.
- URL: https://mojoauth.com/ciam-qna/best-practices-otp-expiration-retry-policies
- Tier: 2
- Confidence: HIGH

### Claim 4.7 — Timing-safe comparison mandatory
- Statement: "Always use timing-safe comparison functions for security-sensitive comparisons, including OTPs." Node.js: `crypto.timingSafeEqual()`.
- URL: https://medium.com/@rakshit.iitp/bcrypt-hmac-sha256-and-otp-security-how-it-all-fits-together-d77065fae2fe
- Tier: 3
- Confidence: HIGH (general crypto consensus)

### Attack vectors for 6-digit OTPs
- Brute force: 10^6 = 1,000,000 combinations. Without attempt limits, trivially enumerable.
- Replay: OTP reused after first successful validation if not invalidated.
- Enumeration: different response for valid vs invalid email leaks user existence.
- Timing attack: non-constant-time comparison leaks hash prefix.

---

## Topic 5: mustChangePassword Guard Pattern

### Claim 5.1 — Guards implement CanActivate, read JWT payload from request.user
- Statement: Guards access decoded JWT payload through `request.user` (set by preceding JwtAuthGuard). Custom guard can inspect any payload field.
- URL: https://oneuptime.com/blog/post/2026-02-02-nestjs-guards-authorization/view
- Tier: 2
- Confidence: HIGH

### Claim 5.2 — Multiple guards execute in order; all must pass
- Statement: "@UseGuards() allows multiple guards. Guards execute in order they are bound. If any guard returns false, request is denied."
- URL: https://docs.nestjs.com/guards
- Tier: 1
- Confidence: HIGH

### Claim 5.3 — Reflector + metadata pattern for route whitelisting
- Statement: Use `Reflector.getAllAndOverride()` with custom `@SetMetadata()` decorator to mark specific routes as exempt from a guard's restriction. This is the canonical pattern for global guards with per-route exceptions.
- URL: https://oneuptime.com/blog/post/2026-02-02-nestjs-guards-authorization/view
- Tier: 2
- Confidence: HIGH

### Claim 5.4 — mustChangePassword field should be in JWT payload
- Statement: For the guard to work without a DB call per request, `mustChangePassword` (or equivalent) must be embedded in the JWT access token payload at login time.
- URL: (derived from guard pattern — no dedicated source found for mustChangePassword specifically)
- Tier: INSUFFICIENT — no primary source found for this specific pattern

---

## Gaps / Insufficient Findings

1. **mustChangePassword-specific NestJS implementation**: No primary source demonstrates this exact pattern. Pattern derivable from guard + metadata mechanics but no authoritative reference.

2. **CSRF mitigations for httpOnly refresh token in NestJS context**: OWASP covers CSRF generally; no NestJS-specific guide for combining httpOnly RT cookie with CSRF token on a REST API.

3. **NestJS 11 breaking changes from 10 regarding auth**: No specific NestJS 11 auth changes documented in search results. NestJS docs page was blocked by bot protection during fetch.

4. **Lucia 2024/2025 exact session recommendation**: Lucia homepage did not return useful content; secondary sources indicate cookie-based session preference but no verbatim Lucia docs quote available.
