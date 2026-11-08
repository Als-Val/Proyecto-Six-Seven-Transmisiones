const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');
const CLAVE_TOKEN = 'sixseven_token';

export function apiUrl(path = '') {
    if (!API_URL) {
        throw new Error(
            'VITE_API_URL no esta definida. Verifica tu archivo client/.env o client/.env.production'
        );

    }
    return `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export const obtenerToken = () => localStorage.getItem(CLAVE_TOKEN);

export function guardarToken(token) {
    if (token) localStorage.setItem(CLAVE_TOKEN, token);
    else localStorage.removeItem(CLAVE_TOKEN);
}

/** Error de la API. `detalle` trae los mensajes por campo: { email: 'mensaje' }. */
export class ApiError extends Error {
    constructor(status, { codigo, mensaje, detalle } = {}) {
        super(mensaje ?? 'No se pudo completar la solicitud');
        this.status = status;
        this.codigo = codigo;
        this.detalle = detalle;
    }
}

export async function apiFetch(path, options = {}) {
    const token = obtenerToken();
    const esArchivo = options.body instanceof FormData;

    const res = await fetch(apiUrl(path), {
        ...options,
        headers: {
            // Con FormData, el navegador define el Content-Type y su separador.
            ...(esArchivo ? {} : { 'Content-Type': 'application/json' }),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (!res.ok) {
        const cuerpo = await res.json().catch(() => ({}));
        // Solo expira una sesión que existía: un login fallido también responde 401.
        if (res.status === 401 && token) window.dispatchEvent(new Event('sesion-expirada'));
        throw new ApiError(res.status, cuerpo.error);
    }
    return res.status === 204 ? null : res.json();
}
