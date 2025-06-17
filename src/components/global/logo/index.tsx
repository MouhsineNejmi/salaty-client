import { IconInnerShadowTop } from "@tabler/icons-react"
import Link from "next/link"

const Logo = () => {
    return (
        <Link href="#" className="flex items-center gap-1">
            <IconInnerShadowTop className="!size-5" />
            <span className="text-base font-semibold">Salaty.</span>
        </Link>
    )
}

export default Logo
