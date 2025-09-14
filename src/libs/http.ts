'use client'

import { useAuthStore } from '@/libs/stores/auth'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

function apiUrl(path: string) {
  if (path.startsWith('/')) return API + path
  return API + '/' + path
}

async function doFetch(path: string, init?: RequestInit) {
  const token = useAuthStore.getState().token
  const headers: Record<string, string> = {
    ...(init?.headers as any),
  }
  if (!(init?.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  return fetch(apiUrl(path), {
    ...init,
    headers,
    credentials: 'include',
  })
}


export async function apiFetch(path: string, init?: RequestInit) {
  let res = await doFetch(path, init)

  if (res.status === 401) {
    const ok = await useAuthStore.getState().refreshAccessToken()
    if (ok) {
      res = await doFetch(path, init)
    }
  }

  if (!res.ok) throw new Error(await safeText(res))
  return safeJson(res)
}

export async function apiUpload(
  path: string,
  file: File,
  fields?: Record<string, string | number | boolean>
): Promise<any> {
  const form = new FormData()
  form.append('file', file)
  if (fields) Object.entries(fields).forEach(([k, v]) => form.append(k, String(v)))

  return apiFetch(path, { method: 'POST', body: form })
}

export function apiUploadWithProgress(
  path: string,
  file: File,
  fields?: Record<string, string | number | boolean>,
  onProgress?: (pct: number) => void
): Promise<any> {
  const token = useAuthStore.getState().token
  const form = new FormData()
  form.append('file', file)
  if (fields) Object.entries(fields).forEach(([k, v]) => form.append(k, String(v)))

  const send = (): Promise<Response> =>
    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', apiUrl(path), true)
      xhr.withCredentials = true
      if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (e) => {
          if (!e.lengthComputable) return
          onProgress(Math.round((e.loaded / e.total) * 100))
        }
      }
      xhr.onload = () => resolve(new Response(xhr.responseText, { status: xhr.status }))
      xhr.onerror = () => reject(new Error('Network error during upload'))
      xhr.send(form)
    })

  return (async () => {
    let resp = await send()
    if (resp.status === 401) {
      const ok = await useAuthStore.getState().refreshAccessToken()
      if (ok) resp = await send()
    }
    if (!resp.ok) throw new Error(await resp.text())
    try { return JSON.parse(await resp.text()) } catch { return {} }
  })()
}

/* ---------- util ---------- */
async function safeJson(res: Response) {
  const text = await res.text()
  try { return text ? JSON.parse(text) : {} } catch { return { raw: text } }
}
async function safeText(res: Response) {
  try { return await res.text() } catch { return `HTTP ${res.status}` }
}