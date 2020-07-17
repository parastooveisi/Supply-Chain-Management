const { createServer } = require('http');
const next = require('next');

const app = next({
  dev: process.env.NODE_ENV !== 'production',
  conf: {
    webpack: config => {
      config.devtool = false;

      for (const r of config.module.rules) {
        if (r.loader === 'babel-loader') {
          r.options.sourceMaps = false;
        }
      }
      return config;
    }
  }
});

const routes = require('./routes');
const handler = routes.getRequestHandler(app);
const PORT = process.env.PORT || 8080;
require('events').EventEmitter.prototype._maxListeners = 500
app.prepare().then(() => {
  createServer(handler).listen(PORT, err => {
    if (err) throw err;
    console.log(`Server listening on port ${PORT}...`);
  });
});