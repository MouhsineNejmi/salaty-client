"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

interface IReactQueryProviderProps {
    children: React.ReactNode
}

const client = new QueryClient()

export const ReactQueryProvider = ({ children }: IReactQueryProviderProps) => {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
