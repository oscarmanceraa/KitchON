// Tipos de datos según el esquema de la base de datos

export interface Estado {
  IdEstado: number;
  Estado: string;
}

export interface TipoProducto {
  IdTipoProducto: number;
  TipoProducto: string;
}

export interface TipoUsuario {
  IdTipoUsuario: number;
  TipoUsuario: string;
}

export interface Persona {
  idPersona: number;
  PrimerNombre: string;
  SegundoNombre?: string;
  PrimerApellido: string;
  SegundoApellido?: string;
}

export interface Producto {
  IdProducto: number;
  IdTipoProducto: number;
  NombreProducto: string;
  Valor: number;
  IdEstado: number;
}

export interface Usuario {
  IdUsuario: number;
  IdPersona: number;
  IdTipoUsuario: number;
  Username: string;
  Password: string;
  IdEstado: number;
}

export interface Mesa {
  IdMesa: number;
  Mesa: string;
}

export interface Orden {
  IdOrden: number;
  IdUsuario: number;
  IdMesa: number;
  IdEstado: number;
  FechaCreacion?: Date;
}

export interface ProductoOrden {
  IdProducto: number;
  IdOrden: number;
  Cantidad?: number;
  Notas?: string;
}

// Vistas combinadas para facilitar el uso en la aplicación
export interface OrdenCompleta extends Orden {
  Usuario?: Usuario;
  Persona?: Persona;
  Mesa?: Mesa;
  Estado?: Estado;
  Productos?: ProductoOrdenDetalle[];
}

export interface ProductoOrdenDetalle extends ProductoOrden {
  Producto?: Producto;
  TipoProducto?: TipoProducto;
}
