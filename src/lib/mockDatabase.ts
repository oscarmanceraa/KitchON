// Mock de base de datos - Reemplazar con llamadas a Supabase
import type {
  Estado,
  TipoProducto,
  TipoUsuario,
  Persona,
  Producto,
  Usuario,
  Mesa,
  Orden,
  ProductoOrden,
} from '../types/database';

// Estados de órdenes, productos y usuarios
export const estados: Estado[] = [
  { IdEstado: 1, Estado: 'Activo' },
  { IdEstado: 2, Estado: 'Pendiente' },
  { IdEstado: 3, Estado: 'En Preparación' },
  { IdEstado: 4, Estado: 'Listo' },
  { IdEstado: 5, Estado: 'Entregado' },
  { IdEstado: 6, Estado: 'Cancelado' },
  { IdEstado: 7, Estado: 'Inactivo' },
];

// Tipos de usuario: Cocina, Mesero, Administrador
export const tiposUsuario: TipoUsuario[] = [
  { IdTipoUsuario: 1, TipoUsuario: 'Administrador' },
  { IdTipoUsuario: 2, TipoUsuario: 'Mesero' },
  { IdTipoUsuario: 3, TipoUsuario: 'Cocina' },
];

// Tipos de productos
export const tiposProducto: TipoProducto[] = [
  { IdTipoProducto: 1, TipoProducto: 'Entrada' },
  { IdTipoProducto: 2, TipoProducto: 'Plato Principal' },
  { IdTipoProducto: 3, TipoProducto: 'Bebida' },
  { IdTipoProducto: 4, TipoProducto: 'Postre' },
  { IdTipoProducto: 5, TipoProducto: 'Acompañamiento' },
];

// Personas
export const personas: Persona[] = [
  { idPersona: 1, PrimerNombre: 'Juan', PrimerApellido: 'Pérez', SegundoApellido: 'García' },
  { idPersona: 2, PrimerNombre: 'María', PrimerApellido: 'González', SegundoApellido: 'López' },
  { idPersona: 3, PrimerNombre: 'Carlos', PrimerApellido: 'Martínez', SegundoApellido: 'Rodríguez' },
  { idPersona: 4, PrimerNombre: 'Chef', PrimerApellido: 'Principal', SegundoApellido: '' },
];

// Usuarios (en producción, el password debe estar hasheado)
export const usuarios: Usuario[] = [
  { IdUsuario: 1, IdPersona: 1, IdTipoUsuario: 1, Username: 'admin', Password: 'admin123', IdEstado: 1 },
  { IdUsuario: 2, IdPersona: 2, IdTipoUsuario: 2, Username: 'maria', Password: 'mesero123', IdEstado: 1 },
  { IdUsuario: 3, IdPersona: 3, IdTipoUsuario: 2, Username: 'carlos', Password: 'mesero123', IdEstado: 1 },
  { IdUsuario: 4, IdPersona: 4, IdTipoUsuario: 3, Username: 'cocina', Password: 'cocina123', IdEstado: 1 },
];

// Mesas del restaurante
export const mesas: Mesa[] = [
  { IdMesa: 1, Mesa: 'Mesa 1' },
  { IdMesa: 2, Mesa: 'Mesa 2' },
  { IdMesa: 3, Mesa: 'Mesa 3' },
  { IdMesa: 4, Mesa: 'Mesa 4' },
  { IdMesa: 5, Mesa: 'Mesa 5' },
  { IdMesa: 6, Mesa: 'Mesa 6' },
  { IdMesa: 7, Mesa: 'Mesa 7' },
  { IdMesa: 8, Mesa: 'Mesa 8' },
  { IdMesa: 9, Mesa: 'Mesa 9' },
  { IdMesa: 10, Mesa: 'Mesa 10' },
];

// Productos del menú
export const productos: Producto[] = [
  { IdProducto: 1, IdTipoProducto: 2, NombreProducto: 'Pizza Margherita', Valor: 12000, IdEstado: 1 },
  { IdProducto: 2, IdTipoProducto: 2, NombreProducto: 'Pizza Pepperoni', Valor: 14000, IdEstado: 1 },
  { IdProducto: 3, IdTipoProducto: 2, NombreProducto: 'Hamburguesa Clásica', Valor: 10000, IdEstado: 1 },
  { IdProducto: 4, IdTipoProducto: 2, NombreProducto: 'Hamburguesa BBQ', Valor: 12000, IdEstado: 1 },
  { IdProducto: 5, IdTipoProducto: 2, NombreProducto: 'Pasta Carbonara', Valor: 13000, IdEstado: 1 },
  { IdProducto: 6, IdTipoProducto: 2, NombreProducto: 'Pasta Bolognesa', Valor: 13000, IdEstado: 1 },
  { IdProducto: 7, IdTipoProducto: 1, NombreProducto: 'Ensalada César', Valor: 8000, IdEstado: 1 },
  { IdProducto: 8, IdTipoProducto: 1, NombreProducto: 'Ensalada Mixta', Valor: 7000, IdEstado: 1 },
  { IdProducto: 9, IdTipoProducto: 5, NombreProducto: 'Papas Fritas', Valor: 4000, IdEstado: 1 },
  { IdProducto: 10, IdTipoProducto: 5, NombreProducto: 'Aros de Cebolla', Valor: 4500, IdEstado: 1 },
  { IdProducto: 11, IdTipoProducto: 1, NombreProducto: 'Alitas de Pollo', Valor: 9000, IdEstado: 1 },
  { IdProducto: 12, IdTipoProducto: 1, NombreProducto: 'Nachos', Valor: 8000, IdEstado: 1 },
  { IdProducto: 13, IdTipoProducto: 3, NombreProducto: 'Refresco', Valor: 2500, IdEstado: 1 },
  { IdProducto: 14, IdTipoProducto: 3, NombreProducto: 'Jugo Natural', Valor: 3000, IdEstado: 1 },
  { IdProducto: 15, IdTipoProducto: 3, NombreProducto: 'Cerveza', Valor: 4000, IdEstado: 1 },
  { IdProducto: 16, IdTipoProducto: 3, NombreProducto: 'Vino', Valor: 15000, IdEstado: 1 },
  { IdProducto: 17, IdTipoProducto: 4, NombreProducto: 'Tiramisú', Valor: 6000, IdEstado: 1 },
  { IdProducto: 18, IdTipoProducto: 4, NombreProducto: 'Helado', Valor: 5000, IdEstado: 1 },
];

// Órdenes de ejemplo
export let ordenes: Orden[] = [
  { IdOrden: 1, IdUsuario: 3, IdMesa: 5, IdEstado: 3, FechaCreacion: new Date(Date.now() - 15 * 60000) },
  { IdOrden: 2, IdUsuario: 2, IdMesa: 3, IdEstado: 2, FechaCreacion: new Date(Date.now() - 5 * 60000) },
  { IdOrden: 3, IdUsuario: 3, IdMesa: 8, IdEstado: 4, FechaCreacion: new Date(Date.now() - 25 * 60000) },
];

// Productos de cada orden
export let productosOrden: ProductoOrden[] = [
  { IdProducto: 1, IdOrden: 1, Cantidad: 2 },
  { IdProducto: 7, IdOrden: 1, Cantidad: 1 },
  { IdProducto: 3, IdOrden: 2, Cantidad: 3, Notas: 'Sin cebolla' },
  { IdProducto: 9, IdOrden: 2, Cantidad: 2 },
  { IdProducto: 5, IdOrden: 3, Cantidad: 1 },
];

// Funciones de utilidad para obtener datos relacionados
export function getPersona(idPersona: number): Persona | undefined {
  return personas.find(p => p.idPersona === idPersona);
}

export function getUsuario(idUsuario: number): Usuario | undefined {
  return usuarios.find(u => u.IdUsuario === idUsuario);
}

export function getMesa(idMesa: number): Mesa | undefined {
  return mesas.find(m => m.IdMesa === idMesa);
}

export function getEstado(idEstado: number): Estado | undefined {
  return estados.find(e => e.IdEstado === idEstado);
}

export function getProducto(idProducto: number): Producto | undefined {
  return productos.find(p => p.IdProducto === idProducto);
}

export function getTipoProducto(idTipoProducto: number): TipoProducto | undefined {
  return tiposProducto.find(tp => tp.IdTipoProducto === idTipoProducto);
}

export function getTipoUsuario(idTipoUsuario: number): TipoUsuario | undefined {
  return tiposUsuario.find(tu => tu.IdTipoUsuario === idTipoUsuario);
}

export function getProductosDeOrden(idOrden: number): ProductoOrden[] {
  return productosOrden.filter(po => po.IdOrden === idOrden);
}

// Función para autenticar usuario
export function autenticarUsuario(username: string, password: string): Usuario | null {
  const usuario = usuarios.find(u => u.Username === username && u.Password === password && u.IdEstado === 1);
  return usuario || null;
}

// Función para obtener el nombre completo de una persona
export function getNombreCompleto(persona: Persona): string {
  return `${persona.PrimerNombre} ${persona.SegundoNombre || ''} ${persona.PrimerApellido} ${persona.SegundoApellido || ''}`.trim();
}

// Función para agregar una orden
export function agregarOrden(orden: Orden): void {
  ordenes.push(orden);
}

// Función para agregar productos a una orden
export function agregarProductosOrden(productos: ProductoOrden[]): void {
  productosOrden.push(...productos);
}

// Función para actualizar el estado de una orden
export function actualizarEstadoOrden(idOrden: number, nuevoIdEstado: number): void {
  const index = ordenes.findIndex(o => o.IdOrden === idOrden);
  if (index !== -1) {
    ordenes[index].IdEstado = nuevoIdEstado;
  }
}

// Función para obtener todas las órdenes
export function getOrdenes(): Orden[] {
  return ordenes;
}

// Función para reemplazar el array de órdenes
export function setOrdenes(nuevasOrdenes: Orden[]): void {
  ordenes = nuevasOrdenes;
}

// Función para eliminar productos de una orden
export function eliminarProductosDeOrden(idOrden: number): void {
  productosOrden = productosOrden.filter(po => po.IdOrden !== idOrden);
}

// ========== CRUD de Usuarios ==========
export function actualizarUsuario(idUsuario: number, datosActualizados: Partial<Usuario>): boolean {
  const index = usuarios.findIndex(u => u.IdUsuario === idUsuario);
  if (index !== -1) {
    usuarios[index] = { ...usuarios[index], ...datosActualizados };
    return true;
  }
  return false;
}

export function crearUsuario(usuario: Usuario): void {
  usuarios.push(usuario);
}

export function eliminarUsuario(idUsuario: number): boolean {
  const index = usuarios.findIndex(u => u.IdUsuario === idUsuario);
  if (index !== -1) {
    usuarios.splice(index, 1);
    return true;
  }
  return false;
}

export function getUsuarios(): Usuario[] {
  return usuarios;
}

// ========== CRUD de Personas ==========
export function actualizarPersona(idPersona: number, datosActualizados: Partial<Persona>): boolean {
  const index = personas.findIndex(p => p.idPersona === idPersona);
  if (index !== -1) {
    personas[index] = { ...personas[index], ...datosActualizados };
    return true;
  }
  return false;
}

export function crearPersona(persona: Persona): void {
  personas.push(persona);
}

export function getPersonas(): Persona[] {
  return personas;
}

// ========== CRUD de Productos ==========
export function actualizarProducto(idProducto: number, datosActualizados: Partial<Producto>): boolean {
  const index = productos.findIndex(p => p.IdProducto === idProducto);
  if (index !== -1) {
    productos[index] = { ...productos[index], ...datosActualizados };
    return true;
  }
  return false;
}

export function crearProducto(producto: Producto): void {
  productos.push(producto);
}

export function eliminarProducto(idProducto: number): boolean {
  const index = productos.findIndex(p => p.IdProducto === idProducto);
  if (index !== -1) {
    productos.splice(index, 1);
    return true;
  }
  return false;
}

export function getProductos(): Producto[] {
  return productos;
}
