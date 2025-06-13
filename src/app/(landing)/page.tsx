"use client"

import { useAuth } from "@/providers/AuthProvider"
import Link from "next/link"

export default function Home() {
    const { user, token } = useAuth()

    console.log("USER: ", user)
    console.log("TOKEN: ", token)

    return (
        <div>
            {!user ? <Link href="/login">login</Link> : <button>logout</button>}
        </div>
    )
}
