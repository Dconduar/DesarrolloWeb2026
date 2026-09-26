import { body, validationResult } from 'express-validator';

export const validarCrearCurso = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('codigo').trim().notEmpty().withMessage('El código único es obligatorio'),
  body('creditos').isInt({ min: 1 }).withMessage('Los créditos deben ser un número mayor a 0'),
];

export function revisarErrores(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  next();
}