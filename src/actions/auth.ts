"use server"

import { redirect } from "next/navigation"

export async function login() {
    redirect("/auth/login")
}

export async function logout() {
    redirect("/auth/logout")
}
