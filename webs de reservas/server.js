const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config');

// Importar rutas
const publicRoutes = require('./routes/public');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

// Inicializar Express
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true en producción con HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Servir archivos estáticos
app.use(express.static('public'));
app.use('/views', express.static('views'));

// Rutas
app.use('/', publicRoutes);
app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);

// Middleware para servir HTML desde views
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/dashboard', (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || config.port || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Servidor iniciado en puerto ${PORT}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📋 Landing pública: http://localhost:${PORT}`);
    console.log(`🔐 Dashboard: http://localhost:${PORT}/dashboard`);
    console.log(`\n⚠️  IMPORTANTE: Asegúrate de haber ejecutado:`);
    console.log(`   1. npm install`);
    console.log(`   2. node database/init.js`);
    console.log(`   3. node utils/create-user.js\n`);
  }
});
