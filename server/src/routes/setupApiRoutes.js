const orderRoutes = require('./orders');
const configRoutes = require('./config');
const mappingRoutes = require('./mappings');
const readerRoutes = require('./readers');
const userRoutes = require('./users');      // now a router
const authRoutes = require('./auth');      // now a router

const setupApiRoutes = (app, io) => {
  app.use((req, res, next) => {
    req.io = io;
    next();
  });

  // Register routers
  app.use('/api/orders', orderRoutes);
  app.use('/api/config', configRoutes);
  app.use('/api/mappings', mappingRoutes);
  app.use('/api/readers', readerRoutes);
  app.use('/api/users', userRoutes);     // ✅ mounted here
  app.use('/api/auth', authRoutes);      // ✅ mounted here
};

module.exports = {
  setupApiRoutes,
};
