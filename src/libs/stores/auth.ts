'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'


function apiUrl(path: string) {
  if (path.startsWith('/')) return API + path
  return API + '/' + path
}

async function safeJson(res: Response) {
  const text = await res.text()
  try { return text ? JSON.parse(text) : {} } catch { return { raw: text } }
}

async function safeText(res: Response) {
  try { return await res.text() } catch { return `HTTP ${res.status}` }
}

function decodeJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  position?: string | null;
  phone?: string | null;
  photoUrl?: string | null;
}

type AuthState = {
  token: string | null
  expiresAt: string | null
  user: User | null
  
  setAuth: (token: string, expISO: string, user?: User | null) => void
  clear: () => void
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  refreshAccessToken: () => Promise<boolean>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      expiresAt: null,
      user: null,

      setAuth: (token, expISO, user) => {
        set({ token, expiresAt: expISO, user: user ?? get().user })
      },

      clear: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('refreshToken');
        }
        set({ token: null, expiresAt: null, user: null });
      },

      signIn: async (email, password) => {
        const res = await fetch(apiUrl('/auth/login'), {
          method: 'POST',
          body: JSON.stringify({ email, password }),
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error('Login gagal, Silahkan periksa password dan email');
        }

        const dt = await res.json();
        const data = dt.data || dt;
        if (!data?.accessToken || !data?.user) {
          throw new Error('Respons tidak lengkap dari server');
        }

        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }

        const user: User = data.user;

        const payload = decodeJwt(data.accessToken);
        if (!payload || !payload.exp) {
          throw new Error('Gagal memproses token: informasi kedaluwarsa tidak ditemukan');
        }

        const expiresAt = new Date(payload.exp * 1000).toISOString();
        
        get().setAuth(data.accessToken, expiresAt, user);
      },

      signOut: async () => {
        try {
          await fetch(apiUrl('/auth/logout'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          });
        } catch {}
                localStorage.removeItem('auth-storage');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('attendance-storage');
        get().clear();
      },

      refreshAccessToken: async () => {
        try {
          const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
          
          if (!refreshToken) {
            get().clear();
            return false;
          }

          const res = await fetch(apiUrl('/auth/refresh'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (!res.ok) {
            get().clear();
            return false;
          }

          const data = await res.json();
          const token = data.accessToken || data.access_token;

          if (!token) {
            get().clear();
            return false;
          }

          if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
          }

          const payload = decodeJwt(token);
          if (!payload || !payload.exp) {
            get().clear();
            return false;
          }

          const expiresAt = new Date(payload.exp * 1000).toISOString();
          get().setAuth(token, expiresAt);
          return true;
        } catch (e) {
          get().clear();
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        expiresAt: state.expiresAt,
        user: state.user,
      }),
    }
  )
);

async function doFetch(path: string, init?: RequestInit) {
  const token = useAuthStore.getState().token;
  const headers: Record<string, string> = {
    ...(init?.headers as any),
  };
  if (!(init?.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) headers['Authorization'] = `Bearer ${token}`;

  return fetch(apiUrl(path), {
    ...init,
    headers,
    credentials: 'include',
  });
}

export async function apiFetch(path: string, init?: RequestInit) {
  let res = await doFetch(path, init);

  if (res.status === 401) {
    const refreshSuccess = await useAuthStore.getState().refreshAccessToken();
    
    if (refreshSuccess) {
      res = await doFetch(path, init);
    }
  }

  if (!res.ok) throw new Error(await safeText(res));
  return safeJson(res);
}