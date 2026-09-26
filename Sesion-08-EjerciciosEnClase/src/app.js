import express from 'express';
import { sequelize } from './db/sequelize.js';
import { sessionMiddleware } from './config/session.js';
import authRoutes from './routes/auth.routes.js';
import cursosRoutes from './routes/cursos.routes.js';

const app = express();

app.use(express.json());

// 5. Reemplaza MemoryStore por PostgreSQL Store
app.use(sessionMiddleware);

// Rutas
app.use('/auth', authRoutes);
app.use('/cursos', cursosRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  console.log('✅ Tablas sincronizadas en PostgreSQL');
  app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  });
});