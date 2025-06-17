"use client"

import Logo from "@/components/global/logo"
import NavUser from "@/components/global/nav-user"
import StoreSelector from "@/components/store-selector"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { useAuth } from "@/providers/AuthProvider"
import { IconPlus } from "@tabler/icons-react"

const SelectStorePage = () => {
    const { user } = useAuth()

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="h-[1100px] w-full max-w-lg bg-white text-black rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <Logo />
                    <NavUser />
                </div>

                <div className="flex items-center justify-between mt-8">
                    <h3 className="text-md">Welcome back, {user?.username}</h3>
                    <Button
                        className="flex items-center gap-2 p-4"
                        variant="secondary"
                    >
                        <IconPlus className="h-4 w-4" />
                        Create Store
                    </Button>
                </div>

                <Separator className="my-8 bg-gray-300" />

                <StoreSelector />
            </div>
        </div>
    )
}

export default SelectStorePage
