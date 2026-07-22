/**
 * Arranque local / Railway: inicializa BD y escucha puerto.
 * En Vercel no se usa: entra por api/index.js.
 */
require('../utils/db');

(async () => {
  const app = require('../app');
  const { ensureBoot } = require('../app');
  const config = require('../config');

  await ensureBoot();

  // No arrancar listen en Vercel
  if (process.env.VERCEL) {
    console.log('Vercel: sin listen (serverless)');
    return;
  }

  const PORT = process.env.PORT || config.port || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Servidor en puerto ${PORT}`);
    console.log(`📋 Panel demos: http://localhost:${PORT}/demos`);
    console.log(`🔐 Dashboard:   http://localhost:${PORT}/dashboard`);
    console.log(`📱 Tenant URL:  http://localhost:${PORT}/d/<slug>\n`);
  });

  const GRACEFUL_SHUTDOWN_MS = 5000;
  function shutdown(signal) {
    console.log(`\n⚠️ ${signal} recibido. Cerrando...`);
    setTimeout(() => process.exit(0), GRACEFUL_SHUTDOWN_MS);
  }
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
})().catch((err) => {
  console.error('Error arranque:', err);
  process.exit(1);
});
