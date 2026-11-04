export function parseStoredAccessToken(stored: string | null): string | null {
  if (!stored) return null
  try {
    const value: unknown = JSON.parse(stored)
    if (
      value &&
      typeof value === 'object' &&
      'accessToken' in value &&
      typeof value.accessToken === 'string' &&
      value.accessToken.trim()
    ) {
      return value.accessToken
    }
  } catch {
    // Malformed browser storage is treated as an unauthenticated session.
  }
  return null
}
