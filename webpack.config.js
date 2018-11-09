const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const isProduction = process.argv.includes('-p')

const scripts = isProduction
    ? [ // Production CDN links
        'https://unpkg.com/react@16.6.1/umd/react.production.min.js',
        'https://unpkg.com/react-dom@16.6.1/umd/react-dom.production.min.js',
        'https://unpkg.com/@material-ui/core@3.3.2/umd/material-ui.production.min.js',
        'https://unpkg.com/p2p-lobby/dist/bundle.min.js',
    ] : [ // Development CDN links (makes building faster)
        'https://unpkg.com/react@16.6.1/umd/react.development.js',
        'https://unpkg.com/react-dom@16.6.1/umd/react-dom.development.js',
        'https://unpkg.com/@material-ui/core@3.3.2/umd/material-ui.development.js',
        'https://unpkg.com/p2p-lobby@0.0.14/dist/bundle.js',
    ]

const plugins = [
    new HtmlWebpackPlugin({
        // Required for 'html-webpack-template'
        inject: false,
        template: require('html-webpack-template'),

        title: 'Sets the Game',
        mobile: true,
        appMountId: 'app',
        lang: 'en',
        scripts,
        links: [
            "https://fonts.googleapis.com/css?family=Roboto:300,400,500",
            "https://fonts.googleapis.com/icon?family=Material+Icons",
        ],
    }),
]

if (!isProduction)
    plugins.push(new webpack.HotModuleReplacementPlugin())

module.exports = {
    mode: 'development',
    entry: {
        app: [
            './src/index.tsx',
            'webpack-hot-middleware/client',
        ],
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'p2p-lobby': 'p2p',
        '@material-ui/core': 'window["material-ui"]',
        // '@material-ui/icons': 'material-icons',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].bundle.js'
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader',
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader",
            },
        ],
    },
    plugins,
}
