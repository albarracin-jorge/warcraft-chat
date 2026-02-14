// CSRF token management (double-submit cookie pattern)
let csrfTokenPromise: Promise<string> | null = null;

export function fetchCsrfToken(): Promise<string> {
  if (!csrfTokenPromise) {
    csrfTokenPromise = fetch("/api/csrf-token", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => data.csrfToken as string)
      .catch((err) => {
        csrfTokenPromise = null; // retry on next call
        throw err;
      });
  }
  return csrfTokenPromise;
}

export function resetCsrfToken() {
  csrfTokenPromise = null;
}
