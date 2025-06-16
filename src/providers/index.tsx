import { Toaster } from "@/components/ui/toaster"
// import { ReduxProvider } from "@/redux/provider"
import { AuthProvider } from "./AuthProvider"
import { ReactQueryProvider } from "./ReactQueryProvider"
import { ThemeProvider } from "./ThemeProvider"

const AppProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
        >
            <ReactQueryProvider>
                <AuthProvider>
                    {/* <ReduxProvider> */}
                    {children}
                    <Toaster />
                    {/* </ReduxProvider> */}
                </AuthProvider>
            </ReactQueryProvider>
        </ThemeProvider>
    )
}

export default AppProviders
