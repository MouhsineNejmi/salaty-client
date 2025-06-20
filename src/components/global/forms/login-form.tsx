"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { FormGenerator } from "@/components/global/form-generator"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

import { ApiError } from "@/lib/error"
import { cn } from "@/lib/utils"
import { useAuth } from "@/providers/AuthProvider"
import { LoginDTO, loginSchema } from "@/validation/auth"

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const { login, isLoginLoading } = useAuth()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginDTO>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
        mode: "onBlur",
    })
    const router = useRouter()

    const onSubmit = async (data: LoginDTO) => {
        try {
            await login(data.email as string, data.password as string)

            toast({ description: "LOGIN SUCCESS!" })
            router.push("/select-store")
        } catch (error: any) {
            const apiError = error as ApiError
            const message =
                apiError?.error?.message ||
                apiError?.message ||
                "Something went wrong. Please try again later!"

            toast({
                title: "Login Failed",
                description: message,
                variant: "destructive",
            })
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>
                        Login with your Google account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-6">
                            <div className="flex flex-col gap-4">
                                <Button variant="outline" className="w-full">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        className="mr-2 h-4 w-4"
                                    >
                                        <path
                                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    Login with Google
                                </Button>
                            </div>
                            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                <span className="bg-card text-muted-foreground relative z-10 px-2">
                                    Or continue with
                                </span>
                            </div>
                            <div className="grid gap-6">
                                <div className="grid gap-3">
                                    <FormGenerator
                                        inputType="input"
                                        type="email"
                                        label="Email"
                                        placeholder="m@example.com"
                                        register={register}
                                        name="email"
                                        errors={errors}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <FormGenerator
                                        inputType="input"
                                        type="password"
                                        label="Password"
                                        placeholder="Enter your password"
                                        register={register}
                                        name="password"
                                        errors={errors}
                                    />
                                    <Link
                                        href="#"
                                        className="ml-auto text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoginLoading}
                                >
                                    {isLoginLoading ? "Logging in..." : "Login"}
                                </Button>
                            </div>
                            <div className="text-center text-sm">
                                Don&apos;t have an account?{" "}
                                <Link
                                    href="/sign-up"
                                    className="underline underline-offset-4"
                                >
                                    Sign up
                                </Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our{" "}
                <Link href="#">Terms of Service</Link> and{" "}
                <Link href="#">Privacy Policy</Link>.
            </div>
        </div>
    )
}
