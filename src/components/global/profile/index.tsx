"use client"

import { useAuth } from "@/providers/AuthProvider"
import Image from "next/image"

export default function Profile() {
    const { user, isLoading } = useAuth()

    return (
        <>
            {isLoading && <p>Loading...</p>}
            {user && (
                <div>
                    <Image
                        // TODO: REPLACE PICTURE
                        src={"https://bundui-images.netlify.app/avatars/10.png"}
                        alt="Profile"
                        width={100}
                        height={100}
                        style={{
                            borderRadius: "50%",
                            width: "80px",
                            height: "80px",
                        }}
                    />
                    <h2>{user.username}</h2>
                    <p>{user.email}</p>
                </div>
            )}
        </>
    )
}
