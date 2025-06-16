import AppProviders from "@/providers"
import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Salaty",
    description: "Salaty a next gen platform to create your store",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={jakarta.className}>
                <AppProviders>{children}</AppProviders>
            </body>
        </html>
    )
}
