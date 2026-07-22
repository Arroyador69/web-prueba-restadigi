/**
 * Compatibilidad: `node server.js` arranca igual que npm start.
 */
const config = require('./config');
const app = require('./app');
const { ensureBoot } = require('./app');

const PORT = process.env.PORT || config.port || 3000;

if (require.main === module) {
  ensureBoot()
    .then(() => {
      if (process.env.VERCEL) return;
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`\n🚀 Servidor en puerto ${PORT}`);
        console.log(`📋 Demos (ventas): http://localhost:${PORT}/demos`);
        console.log(`🔐 Dashboard: http://localhost:${PORT}/dashboard`);
        console.log(`📱 Landing tenant: http://localhost:${PORT}/d/<slug>\n`);
      });
    })
    .catch((err) => {
      console.error('No se pudo arrancar:', err);
      process.exit(1);
    });

  const GRACEFUL_SHUTDOWN_MS = 5000;
  function shutdown(signal) {
    console.log(`\n⚠️ ${signal} recibido. Cerrando...`);
    setTimeout(() => process.exit(0), GRACEFUL_SHUTDOWN_MS);
  }
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

module.exports = app;
