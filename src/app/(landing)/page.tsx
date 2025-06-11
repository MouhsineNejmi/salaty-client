import { login, logout } from "@/actions/auth"
import { auth0 } from "@/lib/auth0"

export default async function Home() {
    const session = await auth0.getSession()

    console.log("SESSION: ", session)

    return (
        <div>
            {!session ? (
                <form action={login}>
                    <button>login</button>
                </form>
            ) : (
                <form action={logout}>
                    <button>logout</button>
                </form>
            )}
        </div>
    )
}
