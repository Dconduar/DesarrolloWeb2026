import { DataTypes } from 'sequelize';
import { sequelize } from '../db/sequelize.js';

export const Curso = sequelize.define('curso', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Código único del curso
  },
  creditos: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'cursos',
});