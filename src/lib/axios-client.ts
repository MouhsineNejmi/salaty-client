import { ACCESS_TOKEN_EXPIRES_IN } from "@/constants"
import axios, { AxiosError, AxiosRequestConfig } from "axios"
import Cookies from "js-cookie"
import { ApiError } from "./error"

const API_BASE =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"

export interface ApiRequestConfig extends AxiosRequestConfig {
    retryOn401?: boolean
}

// Create an axios instance
const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
})

// Attach access token to every request
api.interceptors.request.use((config) => {
    const token = Cookies.get("accessToken")
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Main fetch function
export async function apiFetch<T>(
    endpoint: string,
    config: ApiRequestConfig = {},
): Promise<T> {
    const { retryOn401 = true, ...axiosConfig } = config

    try {
        const response = await api.request<T>({
            url: endpoint,
            ...axiosConfig,
        })
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<any>
            const status = axiosError.response?.status
            const data = axiosError.response?.data

            // Retry on 401 once if allowed
            if (status === 401 && retryOn401) {
                const refreshed = await refreshAccessToken()
                if (refreshed) {
                    return apiFetch<T>(endpoint, {
                        ...config,
                        retryOn401: false,
                    })
                }
            }

            const message =
                data?.message || axiosError.message || "Unknown API error"
            throw new ApiError(message, status || 500, data)
        }

        throw new ApiError("Unexpected error", 500, error)
    }
}

// Refresh access token
export async function refreshAccessToken(): Promise<boolean> {
    const refreshToken = Cookies.get("refreshToken")
    if (!refreshToken) return false

    try {
        const response = await api.post<{ accessToken: string }>(
            "/auth/refresh",
            {
                refreshToken,
            },
        )

        Cookies.set("accessToken", response.data.accessToken, {
            expires: ACCESS_TOKEN_EXPIRES_IN,
        })

        return true
    } catch (error) {
        console.warn("Token refresh failed:", error)
        return false
    }
}
