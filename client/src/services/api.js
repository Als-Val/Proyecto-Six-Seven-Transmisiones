const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

export function apiUrl(path = '') {
    if (!API_URL) {
        throw new Error(
            'VITE_API_URL no esta definida. Verifica tu archivo client/.env o client/.env.production'
        );
        
    }
    return `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export async function apiFetch(path, options = {}) {
    const res = await fetch(apiUrl(path), {
        headers: {
            'Content-Type': 'application/json'
        },
        ...options,
    });
    if (!res.ok) {
        throw new Error(`Error en la solicitud a ${path}: ${res.status} ${res.statusText}`);
    }
    return res.status === 204 ? null : res.json();
}