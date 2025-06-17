import { ACCESS_TOKEN_EXPIRES_IN } from "@/constants"
import Cookies from "js-cookie"
import { ApiError } from "./error"

const API_BASE =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"

interface FetchOptions extends RequestInit {
    /** When true, will try /refresh once if 401 */
    retryOn401?: boolean
}

export async function apiFetch<T>(
    endpoint: string,
    options: FetchOptions = {},
): Promise<T> {
    const { retryOn401, ...rest } = options

    console.log("API FETCH Access token:", Cookies.get("accessToken"))

    const res = await fetch(`${API_BASE}${endpoint}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(rest.headers ?? {}),
            Authorization: `Bearer ${Cookies.get("accessToken") ?? ""}`,
        },
        ...rest,
    })

    if (!res.ok) {
        const data = await res.json()
        const message = data?.error?.message || data?.message || res.statusText
        throw new ApiError(message, res.status, data)
    }

    if (res.status === 401 && retryOn401) {
        const ok = await refreshAccessToken()
        if (ok) {
            return apiFetch<T>(endpoint, { ...options, retryOn401: false })
        }
    }

    let data: any = {}
    try {
        data = await res.json()
    } catch {
        // handle invalid/missing JSON
    }

    return data as Promise<T>
}

/**
 * Calls POST /auth/refresh which should:
 *   1) verify the http‑only refresh cookie
 *   2) rotate and set a *new* refresh cookie
 *   3) return a fresh access token + user (optional)
 */
export async function refreshAccessToken(): Promise<boolean> {
    const userRefreshToken = Cookies.get("refreshToken")

    if (!userRefreshToken) return false

    try {
        const res = await fetch(`${API_BASE}/auth/refresh`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                refreshToken: userRefreshToken,
            }),
        })

        if (!res.ok) return false
        const { accessToken } = await res.json()
        Cookies.set("accessToken", accessToken, {
            expires: ACCESS_TOKEN_EXPIRES_IN,
        })
        return true
    } catch {
        return false
    }
}
