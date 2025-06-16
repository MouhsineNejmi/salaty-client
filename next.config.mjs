/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            new URL("https://bundui-images.netlify.app/avatars/**"),
        ],
    },
}

export default nextConfig
