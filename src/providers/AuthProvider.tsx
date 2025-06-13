"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { createContext, ReactNode, useContext, useMemo } from "react"

import { IAuthResponse } from "@/@types/auth"
import { IUser } from "@/@types/user"
import { apiFetch } from "@/lib/api-client"

interface IAuthContext {
    user: IUser | null
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string) => Promise<void>
    logout: () => void
    isLoginLoading: boolean
}

const AuthContext = createContext<IAuthContext | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const queryClient = useQueryClient()
    const router = useRouter()

    const { data: user } = useQuery<IUser>({
        queryKey: ["auth", "me"],
        queryFn: () => apiFetch<IUser>("/auth/me"),
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })

    const registerMutation = useMutation({
        mutationFn: async (params: { email: string; password: string }) => {
            const response = await apiFetch<IAuthResponse>("auth/register", {
                method: "POST",
                body: JSON.stringify(params),
                retryOn401: false,
            })
            Cookies.set("accessToken", response.accessToken)

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
                body: JSON.stringify(params),
                retryOn401: false,
            })
            Cookies.set("accessToken", res.accessToken, { expires: 0.01 })
            return res.user
        },
        onSuccess: (user) => {
            queryClient.setQueryData(["auth", "me"], user)
        },
    })

    const register = async (email: string, password: string) => {
        await registerMutation.mutateAsync({ email, password })
    }

    const login = async (email: string, password: string) => {
        await loginMutation.mutateAsync({ email, password })
    }

    const logout = async () => {
        await apiFetch("/auth/logout", { method: "POST", retryOn401: false })
        Cookies.remove("accessToken")
        queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
        router.push("/login")
    }

    const value = useMemo<IAuthContext>(() => {
        return {
            user: user ?? null,
            login,
            register,
            logout,
            isLoginLoading: loginMutation.isPending,
        }
    }, [user, loginMutation.isPending])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
    return ctx
}
