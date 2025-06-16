"use client"

import { useAuth } from "@/providers/AuthProvider"
import { useRouter } from "next/navigation"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    if (!isLoading && !user) {
        router.push("/login")
    }

    return <>{children}</>
}

export default DashboardLayout
