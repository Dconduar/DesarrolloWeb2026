import { Router } from 'express';
import { Curso } from './Curso.js';
import { SequelizeCursosRepository } from '../repositories/SequelizeCursosRepository.js';
import { validarCrearCurso, revisarErrores } from '../validators/cursoValidator.js';
import { authJWT } from '../middlewares/authJWT.js';
import { registrarLogAsync } from '../services/loggerService.js';

const router = Router();
const repository = new SequelizeCursosRepository(Curso);

// 2. GET /cursos (Público)
router.get('/', async (req, res) => {
  try {
    const cursos = await repository.listar();
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2, 3 & 6. POST /cursos (Protegido por authJWT + Validado + Fire-and-Forget)
router.post('/', authJWT, validarCrearCurso, revisarErrores, async (req, res) => {
  try {
    const nuevoCurso = await repository.crear(req.body);

    // 6. Log Fire-and-forget (NO lleva await para no demorar la respuesta HTTP)
    registrarLogAsync('CREAR_CURSO', `Curso "${nuevoCurso.nombre}" creado por ${req.usuario.email}`)
      .catch((err) => {
        // Captura de error para evitar unhandled promise rejection
        console.error('❌ Error no bloqueante en Log Fire-and-forget:', err.message);
      });

    // Se responde de inmediato al cliente
    res.status(201).json(nuevoCurso);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;