const title = 'Sets the Game'

const isProduction = process.env.NODE_ENV == 'production' || process.argv.includes('-p')
const path = require('path')
const { HotModuleReplacementPlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OfflinePlugin = require('offline-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const links =[
      'https://fonts.googleapis.com/css?family=Roboto:300,400,500',
      'https://fonts.googleapis.com/icon?family=Material+Icons',
    ],
  scripts = isProduction
    ? [ // Production CDN links
        'https://unpkg.com/react@16.6.1/umd/react.production.min.js',
        'https://unpkg.com/react-dom@16.6.1/umd/react-dom.production.min.js',
        'https://unpkg.com/@material-ui/core@3.3.2/umd/material-ui.production.min.js',
        'https://unpkg.com/p2p-lobby@0.1.1/dist/umd/bundle.js',
        // Seems that this build is broken somehow?? (Probably the experimental methods)
        // 'https://unpkg.com/p2p-lobby@0.1.0/dist/umd/bundle.min.js',
    ] : [ // Development CDN links (makes building faster)
        'https://unpkg.com/react@16.6.1/umd/react.development.js',
        'https://unpkg.com/react-dom@16.6.1/umd/react-dom.development.js',
        'https://unpkg.com/@material-ui/core@3.3.2/umd/material-ui.development.js',
        'https://unpkg.com/p2p-lobby@0.1.1/dist/umd/bundle.js',
    ]

const plugins = [
    new HtmlWebpackPlugin({
        // Required for 'html-webpack-template'
        inject: false,
        template: require('html-webpack-template'),

        title,
        mobile: true,
        appMountId: 'app',
        lang: 'en',

        // Weird horizontal scroll. See: https://github.com/mui-org/material-ui/issues/7466
        headHtmlSnippet: '<style>#app { overflow: hidden }</style>',
        scripts,
        links,
        minify: isProduction && {
            minifyCSS: true,
            minifyJS: true,
            removeAttributeQuotes: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            useShortDoctype: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
        }
    }),
    new WebpackPwaManifest({
        name: title,
        short_name: 'Sets',
        description: 'The Card Game Sets by Mo',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        crossorigin: 'anonymous',
        icons: [{
            src: path.resolve('./Sets.png'),
            sizes: [96, 128, 192, 256, 384, 512, 1024],
        }]
    }),
    new OfflinePlugin({
      extenals: [...scripts, ...links],
    }),
]

if (isProduction)
    plugins.unshift(new CleanWebpackPlugin(['bin']))
else
    plugins.push(new HotModuleReplacementPlugin())

module.exports = {
    mode: 'development',
    entry: {
        app: [ './index.tsx' ],
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'p2p-lobby': 'p2p',
        '@material-ui/core': 'window["material-ui"]',
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
        rules: [{
            test: /\.(ts|tsx)$/,
            loader: 'ts-loader',
        }, {
            enforce: "pre",
            test: /\.js$/,
            loader: "source-map-loader",
        }],
    },
    plugins,
}
