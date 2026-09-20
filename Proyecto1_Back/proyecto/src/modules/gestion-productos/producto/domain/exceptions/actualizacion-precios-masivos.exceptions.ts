export class PreciosMasivosInvalidosException extends Error {
  constructor(
    public readonly errores: string[],
  ) {
    super('No es posible realizar la actualización masiva: uno o más productos quedarían con precio menor o igual a cero.');
  }
}