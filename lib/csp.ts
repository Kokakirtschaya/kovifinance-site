/** Политика браузера: серверным интеграциям CRM, Checko и почты разрешения не нужны. */
export function contentSecurityPolicy(nonce: string, development = false): string {
  if (!/^[a-z0-9+/]{22}==$/i.test(nonce)) throw new Error("Invalid CSP nonce");

  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${development ? " 'unsafe-eval'" : ""}`,
    "script-src-attr 'none'",
    // React и Motion используют атрибуты style и динамические стили.
    // Разрешение inline относится только к CSS, не к JavaScript.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src 'self'${development ? " ws: wss:" : ""}`,
    "object-src 'none'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    ...(!development ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
}
