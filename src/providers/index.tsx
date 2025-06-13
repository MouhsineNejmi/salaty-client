import { Toaster } from "@/components/ui/toaster"
import { ReduxProvider } from "@/redux/provider"
import { AuthProvider } from "./AuthProvider"
import { ReactQueryProvider } from "./ReactQueryProvider"
import { ThemeProvider } from "./ThemeProvider"

const AppProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <ReactQueryProvider>
            <AuthProvider>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    disableTransitionOnChange
                >
                    <ReduxProvider>
                        {children}
                        <Toaster />
                    </ReduxProvider>
                </ThemeProvider>
            </AuthProvider>
        </ReactQueryProvider>
    )
}

export default AppProviders
