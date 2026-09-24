import { HistorialPrecio } from './historial-precio.entity';
import { Producto } from './producto.entity';
import { Precio } from '../value-objects/previo.vo';

/**
 * CP-007-01 – Visualización del historial de precios
 *
 * Se valida que los cambios de precio generados por la
 * entidad Producto contengan todos los datos que la pantalla debe mostrar
 * (fecha/hora, denominación, precio anterior, precio nuevo y motivo).
 */
describe('HistorialPrecio (CP-007-01)', () => {
  const FECHA_FIJA = new Date('2026-09-23T15:30:00.000Z');

  const crearProducto = (id: number, denominacion: string, precio: number): Producto => {
    const p = new Producto();
    p.id = id;
    p.denominacion = denominacion;
    p.margen = 30;
    p.costo = 800;
    p.precio = Precio.crear(precio);
    return p;
  };

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(FECHA_FIJA);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('el constructor asigna precio anterior, precio nuevo, motivo, fecha y producto', () => {
    const producto = crearProducto(1, 'Yerba Mate 1kg', 1150);

    const historial = new HistorialPrecio(
      1150,
      1300,
      'Aumento de costo del proveedor',
      producto,
      10,
    );

    expect(historial.precioAnterior).toBe(1150);
    expect(historial.precioNuevo).toBe(1300);
    expect(historial.motivo).toBe('Aumento de costo del proveedor');
    expect(historial.fecha).toEqual(FECHA_FIJA);
    expect(historial.producto).toBe(producto);
    expect(historial.usuarioId).toBe(10);
  });

  it('cada cambio de precio expone los datos a mostrar: fecha/hora, denominación, anterior, nuevo y motivo', () => {
    const producto = crearProducto(1, 'Yerba Mate 1kg', 1150);

    const historial = producto.actualizarPrecioconHistorial(
      1300,
      'Aumento de costo del proveedor',
      10,
    );

    expect({
      fecha: historial.fecha,
      denominacion: historial.producto.denominacion,
      precioAnterior: historial.precioAnterior,
      precioNuevo: historial.precioNuevo,
      motivo: historial.motivo,
    }).toEqual({
      fecha: FECHA_FIJA,
      denominacion: 'Yerba Mate 1kg',
      precioAnterior: 1150,
      precioNuevo: 1300,
      motivo: 'Aumento de costo del proveedor',
    });
  });

  it('los cambios de distintos productos generan historiales independientes', () => {
    const yerba = crearProducto(1, 'Yerba Mate 1kg', 1150);
    const azucar = crearProducto(2, 'Azúcar 1kg', 500);

    const hYerba = yerba.actualizarPrecioconHistorial(1300, 'Aumento de costo del proveedor', 10);
    const hAzucar = azucar.actualizarPrecioconHistorial(550, 'Ajuste de lista', 10);

    expect(hYerba.producto.denominacion).toBe('Yerba Mate 1kg');
    expect(hYerba.precioNuevo).toBe(1300);
    expect(hAzucar.producto.denominacion).toBe('Azúcar 1kg');
    expect(hAzucar.precioAnterior).toBe(500);
    expect(hAzucar.precioNuevo).toBe(550);
  });

  it('encadena cambios sucesivos: el precio anterior del segundo es el nuevo del primero', () => {
    const producto = crearProducto(1, 'Yerba Mate 1kg', 1150);

    const primero = producto.actualizarPrecioconHistorial(1300, 'Aumento', 10);
    const segundo = producto.actualizarPrecioconHistorial(1400, 'Otro aumento', 10);

    expect(primero.precioNuevo).toBe(1300);
    expect(segundo.precioAnterior).toBe(1300);
    expect(segundo.precioNuevo).toBe(1400);
  });
});
