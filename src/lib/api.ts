// Servicio API para comunicarse con el backend Django
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Interfaz para respuestas de error
interface ApiError {
  error: string;
}

// Función auxiliar para hacer peticiones
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// ========== Autenticación ==========
export interface LoginResponse {
  usuario: any;
  token: string;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>('/api/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function verifyToken(): Promise<{ usuario: any }> {
  return request<{ usuario: any }>('/api/auth/verify/');
}

// ========== Órdenes ==========
export interface OrdenResponse {
  IdOrden: number;
  IdUsuario: number;
  IdMesa: number;
  IdEstado: number;
  FechaCreacion: string;
  Usuario: any;
  Mesa: any;
  Estado: any;
  ProductosOrden: any[];
}

export async function getOrdenes(): Promise<OrdenResponse[]> {
  return request<OrdenResponse[]>('/api/ordenes/');
}

export async function getOrden(id: number): Promise<OrdenResponse> {
  return request<OrdenResponse>(`/api/ordenes/${id}/`);
}

export interface CreateOrdenData {
  IdUsuario: number;
  IdMesa: number;
  IdEstado: number;
  Productos: Array<{
    IdProducto: number;
    Cantidad?: number;
    Notas?: string;
  }>;
}

export async function createOrden(data: CreateOrdenData): Promise<OrdenResponse> {
  return request<OrdenResponse>('/api/ordenes/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateOrdenEstado(id: number, IdEstado: number): Promise<OrdenResponse> {
  return request<OrdenResponse>(`/api/ordenes/${id}/estado/`, {
    method: 'PATCH',
    body: JSON.stringify({ IdEstado }),
  });
}

export async function deleteOrden(id: number): Promise<{ message: string }> {
  return request<{ message: string }>(`/api/ordenes/${id}/`, {
    method: 'DELETE',
  });
}

// ========== Productos ==========
export interface ProductoResponse {
  IdProducto: number;
  IdTipoProducto: number;
  NombreProducto: string;
  Valor: number;
  IdEstado: number;
  TipoProducto?: any;
  Estado?: any;
}

export async function getProductos(): Promise<ProductoResponse[]> {
  return request<ProductoResponse[]>('/api/productos/');
}

export async function getProducto(id: number): Promise<ProductoResponse> {
  return request<ProductoResponse>(`/api/productos/${id}/`);
}

export interface CreateProductoData {
  IdTipoProducto: number;
  NombreProducto: string;
  Valor: number;
  IdEstado: number;
}

export async function createProducto(data: CreateProductoData): Promise<ProductoResponse> {
  return request<ProductoResponse>('/api/productos', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export interface UpdateProductoData {
  IdTipoProducto?: number;
  NombreProducto?: string;
  Valor?: number;
  IdEstado?: number;
}

export async function updateProducto(id: number, data: UpdateProductoData): Promise<ProductoResponse> {
  return request<ProductoResponse>(`/api/productos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteProducto(id: number): Promise<{ message: string }> {
  return request<{ message: string }>(`/api/productos/${id}`, {
    method: 'DELETE',
  });
}

// ========== Usuarios ==========
export interface UsuarioResponse {
  IdUsuario: number;
  IdPersona: number;
  IdTipoUsuario: number;
  Username: string;
  IdEstado: number;
  Persona?: any;
  TipoUsuario?: any;
}

export async function getUsuarios(): Promise<UsuarioResponse[]> {
  return request<UsuarioResponse[]>('/api/usuarios/');
}

// ========== Mesas ==========
export interface MesaResponse {
  IdMesa: number;
  Mesa: string;
}

export async function getMesas(): Promise<MesaResponse[]> {
  return request<MesaResponse[]>('/api/mesas/');
}

// ========== Estados ==========
export interface EstadoResponse {
  IdEstado: number;
  Estado: string;
}

export async function getEstados(): Promise<EstadoResponse[]> {
  return request<EstadoResponse[]>('/api/estados/');
}

// Función para guardar token
export function saveToken(token: string): void {
  localStorage.setItem('token', token);
}

// Función para obtener token
export function getToken(): string | null {
  return localStorage.getItem('token');
}

// Función para eliminar token
export function removeToken(): void {
  localStorage.removeItem('token');
}

