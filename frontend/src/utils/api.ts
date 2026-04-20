export const API_BASE_URL = '/api';

export function getSessionId(): string {
  let id = localStorage.getItem('luxe_session_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('luxe_session_id', id);
  }
  return id;
}

/**
 * Standard fetch wrapper that inherently handles JSON.
 */
export async function fetchApi(endpoint: string, options: RequestInit = {}): Promise<any> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    let errorMessage = 'An error occurred while fetching the data.';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = response.statusText;
    }
    throw new Error(errorMessage);
  }

  // Handle empty responses
  if (response.status === 204) {
    return null;
  }

  return response.json();
}
