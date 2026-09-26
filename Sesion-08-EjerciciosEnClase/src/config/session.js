import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Usuario } from './Usuario.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secreto-super-seguro';

// Registro con contraseña hasheada (bcrypt)
router.post('/registro', async (req, res) => {
  try {
    const { email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({ email, password: passwordHash });
    
    res.status(201).json({ mensaje: 'Usuario registrado con éxito', id: usuario.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login devolviendo JWT
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(401).json({ mensaje: 'Credenciales inválidas' });

    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) return res.status(401).json({ mensaje: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;