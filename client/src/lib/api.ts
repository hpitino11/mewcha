const BASE = (import.meta.env.VITE_API_URL ?? '') + '/api';

function getToken() {
  return localStorage.getItem('mewcha_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  menu: {
    list: (category?: string) =>
      request<import('../types').MenuItem[]>(`/menu${category && category !== 'all' ? `?category=${category}` : ''}`),
    get: (id: number) => request<import('../types').MenuItemDetail>(`/menu/${id}`),
  },
  auth: {
    login: (email: string, password: string) =>
      request<import('../types').AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    signup: (name: string, email: string, password: string) =>
      request<import('../types').AuthResponse>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      }),
  },
  orders: {
    place: (items: unknown[]) =>
      request<import('../types').Order>('/orders', {
        method: 'POST',
        body: JSON.stringify({ items }),
      }),
    list: () => request<import('../types').Order[]>('/orders'),
  },
  admin: {
    menuList: () => request<import('../types').MenuItem[]>('/admin/menu'),
    menuCreate: (data: unknown) =>
      request<import('../types').MenuItem>('/admin/menu', { method: 'POST', body: JSON.stringify(data) }),
    menuUpdate: (id: number, data: unknown) =>
      request<import('../types').MenuItem>(`/admin/menu/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    orderList: () => request<import('../types').Order[]>('/admin/orders'),
    orderUpdate: (id: number, status: string) =>
      request<import('../types').Order>(`/admin/orders/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },
};
