const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no body
  }

  if (!res.ok) {
    throw new Error(data?.error || `Request failed with status ${res.status}`);
  }
  return data;
}

export const api = {
  getSalt: (email) => request(`/auth/salt?email=${encodeURIComponent(email)}`),
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  me: (token) => request('/auth/me', { token }),
  listItems: (token) => request('/vault', { token }),
  createItem: (token, item) => request('/vault', { method: 'POST', body: item, token }),
  updateItem: (token, id, item) => request(`/vault/${id}`, { method: 'PUT', body: item, token }),
  deleteItem: (token, id) => request(`/vault/${id}`, { method: 'DELETE', token }),
};
