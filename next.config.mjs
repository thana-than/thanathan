/** @type {import('next').NextConfig} */

const nextConfig = {
    output: 'export',
    webpack(config) {
        config.module.rules.push({
            test: /\.(glsl|vs|fs|vert|frag)$/,
            exclude: /node_modules/,
            use: [
                'raw-loader',
                'webpack-lygia-loader'
            ]
        });

        return config;
    }
};

export default nextConfig;
