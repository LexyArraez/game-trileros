export class FetchError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'FetchError';
    this.status = status;
  }
}

export async function apiFetch(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new FetchError(`HTTP ${response.status}`, response.status);
  }
  return response.json();
}
