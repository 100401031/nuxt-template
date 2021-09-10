require('dotenv').config();

const APP_PORT = process.env.APP_PORT || '2021';

module.exports = {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'hk-ch-uber-client',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  server: {
    port: APP_PORT
  },

  dev: process.env.NODE_ENV !== 'production',

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // Doc: https://github.com/nuxt-community/composition-api
    '@nuxtjs/composition-api/module',
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    terser: {
      extractComments: false // default was LICENSES
    },
    extend(config, ctx) {
      if (ctx.isClient) {
        config.node = {
          fs: 'empty'
        };
        config.module.rules.push({
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-transform-runtime']
            }
          }
        });
      }
    }
  },
  serverMiddleware: [{ path: '/api', handler: '~/server/routes.js' }],
  telemetry: false
};
