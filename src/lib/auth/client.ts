export function getRedirectUri(path: string = '/auth/callback') {
    return new URL(path, window.location.origin).toString();
  }