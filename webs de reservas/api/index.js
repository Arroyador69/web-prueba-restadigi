/**
 * Entrada serverless para Vercel.
 * Toda la app Express se monta aquí; las rutas las reescribe vercel.json.
 */
const app = require('../app');

module.exports = app;
