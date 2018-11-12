const path = require('path')
const { HotModuleReplacementPlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const isProduction = process.env.NODE_ENV == 'production' || process.argv.includes('-p')

const scripts = isProduction
    ? [ // Production CDN links
        'https://unpkg.com/react@16.6.1/umd/react.production.min.js',
        'https://unpkg.com/react-dom@16.6.1/umd/react-dom.production.min.js',
        'https://unpkg.com/@material-ui/core@3.3.2/umd/material-ui.production.min.js',
        'https://unpkg.com/p2p-lobby@0.0.16/dist/umd/bundle.min.js',
    ] : [ // Development CDN links (makes building faster)
        'https://unpkg.com/react@16.6.1/umd/react.development.js',
        'https://unpkg.com/react-dom@16.6.1/umd/react-dom.development.js',
        'https://unpkg.com/@material-ui/core@3.3.2/umd/material-ui.development.js',
        'https://unpkg.com/p2p-lobby@0.0.16/dist/umd/bundle.js',
    ]

const styles = [
    'body { text-align: center }', // Keep centered cause its a game!
    '#app { overflow: hidden }',   // Weird horizontal scroll. See: https://github.com/mui-org/material-ui/issues/7466
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
        devServer: !isProduction ? 'http://localhost:8080' : undefined,
        headHtmlSnippet: `<style>${styles.join(' ').replace(/\s/g, '')}</style>`, 
        scripts,
        links: [
            "https://fonts.googleapis.com/css?family=Roboto:300,400,500",
            "https://fonts.googleapis.com/icon?family=Material+Icons",
        ],
    }),
]

if (!isProduction)
    plugins.push(new HotModuleReplacementPlugin())

module.exports = {
    mode: 'development',
    entry: {
        app: [ './src/index.tsx' ],
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'p2p-lobby': 'p2p',
        '@material-ui/core': 'window["material-ui"]',
        // '@material-ui/icons': 'material-icons',
    },
    output: {
        path: path.resolve(__dirname, 'bin'),
        filename: '[name].js'
    },
    devtool: isProduction ? false : 'eval-source-map',
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
