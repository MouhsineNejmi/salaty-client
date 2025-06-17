import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

export default function StoreSelector() {
    const [tab, setTab] = useState("active")

    const activeStores = [
        {
            name: "Matjar Layali",
            domain: "jbv0whk-m.myshopify.com",
            avatarText: "ML",
        },
    ]

    const inactiveStores: typeof activeStores = []

    const storesToShow = tab === "active" ? activeStores : inactiveStores

    return (
        <main>
            <Tabs value={tab} onValueChange={setTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 border-b-0">
                    <TabsTrigger value="active" className="rounded-none">
                        Active
                    </TabsTrigger>
                    <TabsTrigger value="inactive" className="rounded-none">
                        Inactive
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={tab} className="mt-0">
                    {storesToShow.length === 0 && (
                        <p className="text-sm text-muted-foreground py-4 text-center">
                            {tab === "active"
                                ? "No active stores"
                                : "No inactive stores"}
                        </p>
                    )}

                    {storesToShow.map((store) => (
                        <div
                            key={store.domain}
                            className="flex items-center gap-3 py-3 rounded-lg hover:bg-muted transition-colors cursor-pointer px-3"
                        >
                            <Avatar className="h-9 w-9 text-xs font-medium">
                                <AvatarFallback>
                                    {store.avatarText}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium leading-none">
                                    {store.name}
                                </p>
                                <p className="text-muted-foreground text-xs lowercase">
                                    {store.domain}
                                </p>
                            </div>
                        </div>
                    ))}
                </TabsContent>
            </Tabs>
        </main>
    )
}
