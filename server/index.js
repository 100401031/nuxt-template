global.__base = __dirname;

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const consola = require('consola');
const { handleError } = require(`${global.__base}/middlewares/errors`);
const { Nuxt, Builder } = require('nuxt');
const app = express();

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js');
config.dev = process.env.NODE_ENV !== 'production';

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  const { host, port } = nuxt.options.server;

  await nuxt.ready();
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  // body-parser middleware
  app.use(express.json());

  let accountStr = '';
  if (
    process.env.MONGO_ACCOUNTS_COOKIE_SESSION_USER &&
    process.env.MONGO_ACCOUNTS_COOKIE_SESSION_PASSWORD
  ) {
    accountStr = `${process.env.MONGO_ACCOUNTS_COOKIE_SESSION_USER}:${process.env.MONGO_ACCOUNTS_COOKIE_SESSION_PASSWORD}@`;
  }

  let mongodbUrl = null;
  if (
    process.env.MONGO_ACCOUNTS_COOKIE_SESSION_HOST &&
    process.env.MONGO_ACCOUNTS_COOKIE_SESSION_HOST1
  ) {
    mongodbUrl = `mongodb://${accountStr}${process.env.MONGO_ACCOUNTS_COOKIE_SESSION_HOST}:27017,${process.env.MONGO_ACCOUNTS_COOKIE_SESSION_HOST1}:27017/?authSource=admin&replicaSet=rs0&readPreference=secondaryPreferred`;
  } else {
    mongodbUrl = `mongodb://${accountStr}${process.env.MONGO_ACCOUNTS_COOKIE_SESSION_HOST}:27017/?authSource=admin`;
  }

  // session middleware
  const sessConf = {
    store: MongoStore.create({
      dbName: 'user-accounts',
      mongoUrl: mongodbUrl,
      ttl: 30 * 24 * 60 * 60, // = 30 days. Default
      mongoOptions: {
        maxPoolSize: 100
      }
    }),
    name: 'MAGSID',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 24 * 1000 * 365 * 20, // tmp for cookie will not expire.
      HttpOnly: true,
      domain: process.env.COOKIE_DOMAIN
    }
  };
  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', true);
    sessConf.cookie.secure = true; // serve secure cookies
  }
  app.use(session(sessConf));

  // errors handling middlewares.
  app.use((err, req, res, next) => {
    handleError(err, res);
  });

  // Give nuxt middleware to express
  app.use(nuxt.render);

  // Listen the server
  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  });
}
start();
