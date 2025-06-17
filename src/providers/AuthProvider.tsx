"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { createContext, ReactNode, useContext, useMemo } from "react"

import { IAuthResponse } from "@/@types/auth"
import { IUser } from "@/@types/user"
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from "@/constants"
import { apiFetch } from "@/lib/axios-client"
import { ApiError } from "@/lib/error"

interface IAuthContext {
    user: IUser | null
    login: (email: string, password: string) => Promise<void>
    signup: (username: string, email: string, password: string) => Promise<void>
    logout: () => void
    isLoading: boolean
    isLoginLoading: boolean
    isSignupLoading: boolean
}

const AuthContext = createContext<IAuthContext | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const queryClient = useQueryClient()
    const router = useRouter()

    const { data: user, isLoading: isLoadingUser } = useQuery<IUser | null>({
        queryKey: ["auth", "me"],
        queryFn: async () => {
            try {
                return await apiFetch<IUser>("/auth/me")
            } catch (error) {
                if (error instanceof ApiError && error.status === 401) {
                    return null
                }
                throw error
            }
        },
        retry: false,
        enabled: !!Cookies.get("accessToken"),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })

    const signupMutation = useMutation({
        mutationFn: async (params: {
            username: string
            email: string
            password: string
        }) => {
            const response = await apiFetch<IAuthResponse>("/auth/register", {
                method: "POST",
                data: params,
                retryOn401: false,
            })
            Cookies.set("accessToken", response.accessToken, {
                expires: ACCESS_TOKEN_EXPIRES_IN,
            })
            Cookies.set("refreshToken", response.user.refreshToken!, {
                expires: REFRESH_TOKEN_EXPIRES_IN,
            })

            return response
        },
        onSuccess(data) {
            queryClient.setQueryData(["auth", "me"], data.user)
        },
    })

    const loginMutation = useMutation({
        mutationFn: async (params: { email: string; password: string }) => {
            const res = await apiFetch<IAuthResponse>("/auth/login", {
                method: "POST",
                data: params,
                retryOn401: false,
            })
            Cookies.set("accessToken", res.accessToken, {
                expires: ACCESS_TOKEN_EXPIRES_IN,
            })
            Cookies.set("refreshToken", res.user.refreshToken!, {
                expires: REFRESH_TOKEN_EXPIRES_IN,
            })
            return res.user
        },
        onSuccess: (user) => {
            queryClient.setQueryData(["auth", "me"], user)
        },
    })

    const signup = async (
        username: string,
        email: string,
        password: string,
    ) => {
        await signupMutation.mutateAsync({ username, email, password })
    }

    const login = async (email: string, password: string) => {
        await loginMutation.mutateAsync({ email, password })
    }

    const logout = async () => {
        await apiFetch("/auth/logout", { method: "POST", retryOn401: false })
        Cookies.remove("accessToken")
        Cookies.remove("refreshToken")
        queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
        router.push("/login")
    }

    const isLoading =
        loginMutation.isPending || signupMutation.isPending || isLoadingUser

    const value = useMemo<IAuthContext>(() => {
        return {
            user: user ?? null,
            login,
            signup,
            logout,
            isLoading,
            isSignupLoading: signupMutation.isPending,
            isLoginLoading: loginMutation.isPending,
        }
    }, [user, isLoading])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
    return ctx
}
