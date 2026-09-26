export class SequelizeCursosRepository {
  constructor(modeloCurso) {
    this.modelo = modeloCurso;
  }

  async listar() {
    return await this.modelo.findAll({ order: [['nombre', 'ASC']] });
  }

  async obtenerPorId(id) {
    return await this.modelo.findByPk(id);
  }

  async crear(datos) {
    return await this.modelo.create(datos);
  }
}