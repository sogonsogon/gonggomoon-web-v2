export const PROTECTED_ROUTE_PREFIXES = ['/strategy', '/experience'] as const;

export const isProtectedRoute = (pathname: string): boolean =>
  PROTECTED_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
