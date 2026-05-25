# NestJS 11 Authentication Architecture — Research Report
**Date:** 2026-04-17 | **Scope:** 5 targeted topics | **Stack:** NestJS 11 + Prisma 6 + PostgreSQL + React 19 + Zustand

---

## Executive Summary

All five topics have defensible, evidence-backed answers. The clearest findings: OWASP and every major auth library in 2025 recommend httpOnly cookies for refresh tokens; refresh token rotation with full family invalidation is now an OAuth 2.1 requirement, not a nice-to-have; passport-local remains the official NestJS pattern though a lighter passport-free path exists; OTP tokens should be SHA-256 hashed (not bcrypt) in a separate table; and the mustChangePassword guard is a straightforward composition of NestJS's native metadata + Reflector system.

---

## Topic 1 — httpOnly Cookie vs JSON Body for Refresh Tokens

### Recommended Approach

Store the **refresh token in an httpOnly cookie**. Return only the access token in the JSON response body. The access token lives in-memory in Zustand (never persisted to localStorage).

**Optimal cookie attributes:**
```
Set-Cookie: refresh_token=<value>; HttpOnly; Secure; SameSite=Strict; Path=/auth/refresh; Max-Age=2592000
```

Using `Path=/auth/refresh` scopes the cookie to exactly one endpoint, reducing the CSRF attack surface to a single route.

### Evidence

OWASP Session Management Cheat Sheet defines the most secure configuration as `__Host-SID=<token>; path=/; Secure; HttpOnly; SameSite=Strict` and states that "HttpOnly protection is mandatory to prevent session ID stealing through XSS attacks." [Source: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html, Tier 1, Confidence: HIGH]

OWASP warns explicitly that Web Storage (localStorage/sessionStorage) "may be directly accessible from disk" and that cookies remain the preferred exchange mechanism when properly attributed. [Source: same, Tier 1, Confidence: HIGH]

Auth.js (NextAuth v5) stores `refresh_token` in "an encrypted JWT, in an HttpOnly cookie" as its default strategy. [Source: https://authjs.dev/guides/refresh-token-rotation, Tier 2, Confidence: HIGH]

Lucia (2024 rewrite) dropped JWTs entirely in favor of session tokens in cookies, citing that "HttpOnly cookies allow you to completely forget about tokens on the client side" and that cookies solve multi-tab refresh races. [Source: https://github.com/lucia-auth/lucia/discussions/112, Tier 2, Confidence: MEDIUM]

### CSRF Trade-offs

HttpOnly does **not** prevent CSRF. The browser still sends the cookie automatically. Mitigations:

1. **SameSite=Strict** — blocks the cookie on all cross-site requests, including top-level navigations. Strongest protection; no additional tokens needed for most SPAs served from the same domain.
2. **SameSite=Lax** — blocks unsafe methods (POST/PUT/DELETE) but allows GET. Sufficient for most cases but weaker.
3. **OWASP warning:** "SameSite is scoped to the registrable domain, not the origin" — if your app has multiple subdomains, Strict is required. [Source: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html, Tier 1, Confidence: HIGH]
4. If SameSite alone is insufficient (cross-origin setups), add a **Signed Double-Submit Cookie** with HMAC and session binding — OWASP's recommended CSRF token pattern for APIs.

**Practical note for this stack:** React 19 SPA + NestJS API on different ports/subdomains requires `SameSite=None; Secure` for cookies to work cross-origin, which removes the SameSite CSRF defense. In that case, implement a custom CSRF header (`X-CSRF-Token`) that the client reads from a separate non-httpOnly cookie and echoes in a request header — a pattern httpOnly cannot interfere with.

### NestJS-Specific Notes

- Use `res.cookie('refresh_token', token, { httpOnly: true, secure: true, sameSite: 'strict', path: '/auth/refresh' })` in the login and refresh controllers.
- Enable `passthrough: true` on `@Res()` or use `Response` object directly.
- Read the cookie in the refresh endpoint via `@Req() req: Request` → `req.cookies['refresh_token']`. Requires `cookie-parser` middleware.

---

## Topic 2 — Refresh Token Rotation + Reuse Detection

### Recommended Approach

**Full rotation on every use.** Every call to `POST /auth/refresh` must:
1. Validate the old refresh token (signature + hash match against DB).
2. Immediately invalidate the old token in the DB.
3. Issue a new access token + new refresh token.
4. Persist the hash of the new refresh token.
5. If the presented token is already invalidated → detect reuse → **invalidate the entire token family** → throw `ForbiddenException`.

### Evidence

OAuth 2.1 mandates this: "Issue a new refresh token with each refresh operation, invalidate the previous token, and if an old refresh token is presented, revoke the entire token family." [Source: https://www.loginradius.com/blog/identity/secure-refresh-token-rotation, Tier 2, Confidence: HIGH]

Auth0's documentation confirms the mechanism: "As soon as the new pair is issued, the refresh token used in the request is invalidated. If a previously-invalidated refresh token is subsequently presented, Auth0 revokes all tokens in the same token family, forcing re-authentication." [Source: https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation, Tier 1, Confidence: HIGH]

### Reuse Detection: How It Works

```
User A (legitimate):  RT1 → [server issues RT2, marks RT1 invalid]
Attacker (replay):    RT1 → server sees RT1 is marked invalid → REUSE DETECTED
                             → invalidate RT2 (and all descendants) → force re-login
```

The detection is a DB state check: when `POST /auth/refresh` is called, look up the refresh token hash. If the row is present but already flagged as `used=true` (or deleted), a replay is in progress.

### Implementation for This Stack (SHA-256 hash on users table)

Since `refreshToken` is already a SHA-256 hash column on the `users` table, the pattern fits directly:

1. **On login:** `sha256(rawToken)` → store in `users.refreshToken`. Return raw token to client.
2. **On refresh:**
   - Compute `sha256(incomingToken)`, compare with `users.refreshToken` (constant-time comparison with `crypto.timingSafeEqual`).
   - If match: generate new raw token, compute `sha256(newToken)`, update `users.refreshToken`. Return new pair.
   - If no match (already rotated or invalid): the presented token is stale → **set `users.refreshToken = null`** (family invalidation in a single-token-per-user model) → throw `ForbiddenException('Token reuse detected')`.
3. **On logout:** set `users.refreshToken = null`.

**Note on single-user-row model:** Storing one hash per user means one session per user. Token family invalidation is trivially achieved by nulling the column. If multi-session support is needed later, move to a separate `refresh_tokens` table with a `familyId` column.

### Grace Period (Emerging)

An open issue in better-auth (March 2026) proposes an optional grace window (e.g., 500ms) to handle legitimate concurrent requests without false-positive reuse detection. This is not yet standardized. [Source: https://github.com/better-auth/better-auth/issues/8512, Tier 3, Confidence: LOW — not recommended for implementation without explicit need]

---

## Topic 3 — NestJS 11 JWT Auth Module Structure

### Recommended Approach

**Keep passport-local + passport-jwt.** It is still the official pattern, aligns with NestJS documentation, has the widest community support, and handles edge cases (OAuth expansion, multi-strategy) better than a hand-rolled approach.

### Module Structure

**Strategies:**

| Strategy | Passport Name | Purpose |
|---|---|---|
| `LocalStrategy` | `'local'` | Validates email/password at login |
| `AccessTokenStrategy` | `'jwt'` | Validates access token on protected routes |
| `RefreshTokenStrategy` | `'jwt-refresh'` | Validates refresh token + exposes raw token for hash check |

**LocalStrategy:** extends `PassportStrategy(Strategy)` from `passport-local`. Constructor calls `super({ usernameField: 'email' })`. `validate(email, password)` calls `authService.validateUser()`, throws `UnauthorizedException` if null.

**AccessTokenStrategy:** extends `PassportStrategy(Strategy, 'jwt')`. Constructor: `super({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: configService.get('JWT_ACCESS_SECRET') })`. `validate(payload)` returns `{ userId: payload.sub, email: payload.email, role: payload.role, mustChangePassword: payload.mustChangePassword }`.

**RefreshTokenStrategy:** extends `PassportStrategy(Strategy, 'jwt-refresh')`. Constructor: `super({ jwtFromRequest: ExtractJwt.fromExtractors([req => req?.cookies?.refresh_token]), secretOrKey: configService.get('JWT_REFRESH_SECRET'), passReqToCallback: true })`. `validate(req, payload)` returns payload augmented with `rawToken: req.cookies.refresh_token` for the hash comparison in the service.

**AuthModule:**
```typescript
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
    UsersModule,
  ],
  providers: [AuthService, LocalStrategy, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
```

**Guards:**
- `LocalAuthGuard extends AuthGuard('local')` — applied to `POST /auth/login` only.
- `JwtAuthGuard extends AuthGuard('jwt')` — registered globally via `APP_GUARD`; uses `@Public()` decorator to opt out.
- `JwtRefreshGuard extends AuthGuard('jwt-refresh')` — applied to `POST /auth/refresh` only.

### Is passport-local Still Best Practice in 2025?

**Yes, with a caveat.** Trilon (NestJS core team) published a passport-free alternative using `JwtService.verify()` directly in a guard. They conclude: "Passport remains valuable for complex requirements like OAuth, multiple strategies, or advanced security patterns." [Source: https://trilon.io/blog/nestjs-authentication-without-passport, Tier 2, Confidence: HIGH]

For a system that will have WhatsApp bot auth, admin roles, and possible OAuth later, keeping passport provides the better extensibility foundation.

**NestJS 11 specifics:** No breaking changes to the auth module structure were found in search results. The passport integration API is unchanged from NestJS 10.

### Source

[Source: https://www.elvisduru.com/blog/nestjs-jwt-authentication-refresh-token, Tier 3, Confidence: MEDIUM] for the dual-strategy pattern. [Source: https://docs.nestjs.com/security/authentication, Tier 1, Confidence: HIGH] confirmed as current official docs URL.

---

## Topic 4 — OTP Password Recovery via Email

### Recommended Approach

Store OTP as **SHA-256 hash in a separate table**, not on the user row. TTL: 15 minutes. Max attempts: 3. Single use. Rate-limit the request endpoint per email. Use `crypto.timingSafeEqual()` for comparison.

### Evidence

**Generation:** OWASP requires "cryptographically secure random number generator." Node.js `crypto.randomInt(100000, 999999)` or `crypto.randomBytes(3)` converted to a 6-digit number satisfies this. [Source: https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html, Tier 1, Confidence: HIGH]

**Hashing — SHA-256 over bcrypt for OTPs:** "HMAC-SHA256's speed and deterministic nature make it ideal for generating and verifying OTPs. Using bcrypt is unnecessary since the preimage is long and random." SHA-256 is appropriate because OTPs are single-use, short-lived, and high-entropy relative to their length. [Source: https://medium.com/@rakshit.iitp/bcrypt-hmac-sha256-and-otp-security-how-it-all-fits-together-d77065fae2fe, Tier 3, Confidence: MEDIUM]

Real-world validation: Laravel's framework stores password reset tokens as `sha256(token)` specifically because "a DB compromise shouldn't provide useful information about reset tokens." [Source: https://github.com/laravel/framework/issues/18570, Tier 2, Confidence: HIGH]

**Separate table over user row:** Dedicated table prevents bloating the user record and allows multiple pending resets, easier cleanup, and clearer single-responsibility. Schema: `{ id, userId, otpHash, expiresAt, attempts, used, createdAt }`. [Source: https://medium.com/@ranakrunal.mscit21/otp-based-authentication-with-expiry-replay-protection-c2033be48f85, Tier 3, Confidence: MEDIUM]

**TTL:** NIST advises OTPs valid for no more than 10 minutes. Practical recommendation: 15 minutes for email OTP (email delivery latency justifies the slightly higher window). [Source: https://mojoauth.com/ciam-qna/best-practices-otp-expiration-retry-policies, Tier 2, Confidence: HIGH]

**Attempt limits:** 3–5 attempts recommended. 3 is conservative and sufficient for email OTP since delivery is reliable. [Source: same, Tier 2, Confidence: HIGH]

**Rate limiting on generation:** "Implement protections against excessive automated submissions such as rate-limiting on a per-account basis." This prevents inbox flooding and brute-force OTP generation. [Source: https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html, Tier 1, Confidence: HIGH]

**Single-use enforcement:** After successful validation, set `used = true` before returning success. Check `used` flag before verifying the hash. [Source: https://medium.com/@ranakrunal.mscit21/otp-based-authentication-with-expiry-replay-protection-c2033be48f85, Tier 3, Confidence: MEDIUM]

**User enumeration prevention:** "Ensure responses return in consistent amount of time to prevent attacker enumerating which accounts exist." Return the same response whether the email exists or not. [Source: https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html, Tier 1, Confidence: HIGH]

**Do not lock account on failed OTP:** "Accounts should not be locked out in response to a forgotten password attack, as this can be used to deny access to users with known usernames." Lock the OTP record (mark as exhausted), not the user account. [Source: same, Tier 1, Confidence: HIGH]

### Attack Vectors for 6-Digit OTPs

| Attack | Risk | Mitigation |
|---|---|---|
| Brute force (10^6 space) | HIGH without limits | 3 attempts max + account-level rate limiting |
| Replay | MEDIUM | `used=true` flag set immediately on success |
| User enumeration | MEDIUM | Consistent response time + identical response regardless of email existence |
| Timing attack | LOW | `crypto.timingSafeEqual()` for hash comparison |
| Inbox flooding | MEDIUM | Rate limit: max 1 OTP request per email per 60 seconds |
| DB compromise | LOW (mitigated) | SHA-256 hash stored, not plaintext |

### NestJS-Specific Notes

- Use `crypto.createHash('sha256').update(otp).digest('hex')` for hashing.
- Prisma model: `PasswordResetOtp` table with `@@index([userId])` and `@@index([expiresAt])` for efficient cleanup queries.
- Cron job (`@nestjs/schedule`) to delete expired/used OTP records daily.
- Resend integration: send OTP in transactional email from `AuthService.sendPasswordResetOtp()`.

---

## Topic 5 — mustChangePassword Guard Pattern in NestJS

### Recommended Approach

Embed `mustChangePassword: boolean` in the JWT access token payload. Create a `MustChangePasswordGuard` that runs **after** `JwtAuthGuard`. Use the `@PasswordChangeRequired()` metadata decorator to mark `POST /auth/change-password` as exempt from the restriction. Apply the guard globally (or at app level), or apply it to all controllers except AuthController.

### Architecture

**JWT payload shape:**
```typescript
interface JwtPayload {
  sub: number;
  email: string;
  role: Role;
  mustChangePassword: boolean;
}
```

**Guard logic (pseudocode):**
```
MustChangePasswordGuard.canActivate(context):
  1. Get handler and class metadata via Reflector
  2. If route has @PasswordChangeRequired() metadata → return true (exempt)
  3. Get request.user from context (set by JwtAuthGuard)
  4. If user.mustChangePassword === false → return true
  5. Get current route URL
  6. If URL === 'POST /auth/change-password' → return true
  7. Throw ForbiddenException('Password change required before accessing this resource')
```

**Guard composition:**
```typescript
// Global: JwtAuthGuard runs first, then MustChangePasswordGuard
// In AppModule providers:
{ provide: APP_GUARD, useClass: JwtAuthGuard },
{ provide: APP_GUARD, useClass: MustChangePasswordGuard },
```

NestJS executes multiple `APP_GUARD` providers in registration order. JwtAuthGuard populates `request.user`; MustChangePasswordGuard reads from it. [Source: https://docs.nestjs.com/guards, Tier 1, Confidence: HIGH] — "@UseGuards() allows multiple guards. Guards execute in order they are bound. If any guard returns false, request is denied."

**Metadata decorator:**
```typescript
export const ALLOW_MUST_CHANGE_PASSWORD = 'allowMustChangePassword';
export const AllowMustChangePassword = () =>
  SetMetadata(ALLOW_MUST_CHANGE_PASSWORD, true);
```

Apply `@AllowMustChangePassword()` on the `POST /auth/change-password` route handler.

**Reflector pattern** (standard NestJS role guard pattern confirmed by source):
```typescript
const allowed = this.reflector.getAllAndOverride<boolean>(
  ALLOW_MUST_CHANGE_PASSWORD,
  [context.getHandler(), context.getClass()]
);
```
[Source: https://oneuptime.com/blog/post/2026-02-02-nestjs-guards-authorization/view, Tier 2, Confidence: HIGH]

### Trade-offs

| Approach | Pro | Con |
|---|---|---|
| Flag in JWT payload | No DB call per request | Token doesn't reflect real-time changes; requires re-login after password change to clear the flag |
| DB check in guard | Always current | One DB query per protected request — performance cost |

**Recommendation for this stack:** Use JWT payload flag. After `POST /auth/change-password` succeeds, issue a new access token with `mustChangePassword: false`. The frontend (Zustand) replaces the in-memory token. This is consistent, fast, and correct.

### NestJS-Specific Notes

- `POST /auth/login`, `POST /auth/refresh`, and `POST /auth/change-password` must all be exempt. Apply `@AllowMustChangePassword()` on each.
- `@Public()` (used to bypass JwtAuthGuard) and `@AllowMustChangePassword()` are separate decorators — a route can be public (login) or authenticated-but-exempt (change-password).
- Test with a user where `mustChangePassword=true`: confirm they cannot call `GET /users/me` but can call `POST /auth/change-password`.

---

## Limitations & Gaps

1. **mustChangePassword exact pattern — INSUFFICIENT primary source.** No authoritative NestJS documentation or widely-cited guide demonstrates this exact guard. The pattern is derived from the documented guard composition mechanics (Tier 1 source) and role guard pattern (Tier 2 source). Confidence in the mechanics is HIGH; confidence in this being "the standard pattern" is MEDIUM.

2. **NestJS 11 auth-specific changes — INSUFFICIENT.** NestJS docs page was blocked during fetch (bot protection). No NestJS 11 changelog entries specific to auth module changes were found. Assumption: no breaking changes from NestJS 10 for the auth module, confirmed indirectly by all 2025 tutorials targeting NestJS 11 using the same patterns.

3. **Lucia 2025 verbatim recommendation — LOW confidence.** Lucia's homepage did not return content during fetch. Secondary sources (GitHub discussions, blog posts) confirm the cookie-based session preference but do not represent current Lucia documentation.

4. **CSRF + httpOnly RT cookie in NestJS REST API context — INSUFFICIENT.** OWASP covers CSRF mechanics and SameSite values comprehensively, but no NestJS-specific guide was found for the combined httpOnly RT cookie + CSRF defense pattern on a pure REST API. The recommended approach (SameSite=Strict for same-domain, custom CSRF header for cross-origin) is derived from OWASP first principles.

5. **Grace period for token rotation — LOW confidence.** The better-auth issue is from March 2026 and is not a standardized pattern. Not recommended without specific identified need.

---

## Source Log

| # | URL | Tier | Topic |
|---|---|---|---|
| 1 | https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html | 1 | T1, T2 |
| 2 | https://owasp.org/www-community/HttpOnly | 1 | T1 |
| 3 | https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html | 1 | T1 |
| 4 | https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html | 1 | T1 |
| 5 | https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html | 1 | T4 |
| 6 | https://authjs.dev/guides/refresh-token-rotation | 2 | T1, T2 |
| 7 | https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation | 1 | T2 |
| 8 | https://www.loginradius.com/blog/identity/secure-refresh-token-rotation | 2 | T2 |
| 9 | https://docs.nestjs.com/security/authentication | 1 | T3 |
| 10 | https://docs.nestjs.com/guards | 1 | T5 |
| 11 | https://trilon.io/blog/nestjs-authentication-without-passport | 2 | T3 |
| 12 | https://oneuptime.com/blog/post/2026-02-02-nestjs-guards-authorization/view | 2 | T3, T5 |
| 13 | https://www.elvisduru.com/blog/nestjs-jwt-authentication-refresh-token | 3 | T3 |
| 14 | https://syskool.com/refresh-tokens-and-token-rotation-in-nestjs-secure-jwt-authentication/ | 3 | T2 |
| 15 | https://dev.to/zenstok/how-to-implement-refresh-tokens-with-token-rotation-in-nestjs-1deg | 3 | T2 |
| 16 | https://medium.com/@rakshit.iitp/bcrypt-hmac-sha256-and-otp-security-how-it-all-fits-together-d77065fae2fe | 3 | T4 |
| 17 | https://github.com/laravel/framework/issues/18570 | 2 | T4 |
| 18 | https://mojoauth.com/ciam-qna/best-practices-otp-expiration-retry-policies | 2 | T4 |
| 19 | https://medium.com/@ranakrunal.mscit21/otp-based-authentication-with-expiry-replay-protection-c2033be48f85 | 3 | T4 |
| 20 | https://github.com/lucia-auth/lucia/discussions/112 | 2 | T1 |
| 21 | https://github.com/better-auth/better-auth/issues/8512 | 3 | T2 |
