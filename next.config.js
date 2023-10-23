/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY
    },
    webpack(config) {
        config.externals = [...config.externals, 'hnswlib-node'];
        return config
    }
}

module.exports = nextConfig
