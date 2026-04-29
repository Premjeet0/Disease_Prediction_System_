/**
 * API helper utilities
 * Centralized place for API calls and fetch utilities
 */

/**
 * Base fetch wrapper with error handling
 */
export async function fetcher<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
    }));
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
}

/**
 * API client with common methods
 */
export const api = {
  get: async <T>(url: string): Promise<T> => {
    return fetcher<T>(url, { method: 'GET' });
  },

  post: async <T>(url: string, data: unknown): Promise<T> => {
    return fetcher<T>(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  put: async <T>(url: string, data: unknown): Promise<T> => {
    return fetcher<T>(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  delete: async <T>(url: string): Promise<T> => {
    return fetcher<T>(url, { method: 'DELETE' });
  },

  patch: async <T>(url: string, data: unknown): Promise<T> => {
    return fetcher<T>(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },
};
