import { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { KitchenDashboard } from './components/KitchenDashboard';
import { WaiterDashboard } from './components/WaiterDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Toaster } from './components/ui/sonner';
import type { Usuario, Orden, OrdenCompleta, ProductoOrdenDetalle } from './types/database';
import * as API from './lib/api';
import { toast } from 'sonner';

export type UserRole = 'Cocina' | 'Mesero' | 'Administrador' | null;

function App() {
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [ordenes, setOrdenes] = useState<OrdenCompleta[]>([]);
  const [loading, setLoading] = useState(true);

  // Verificar token al iniciar
  useEffect(() => {
    const token = API.getToken();
    if (token) {
      verifyAndLoadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyAndLoadUser = async () => {
    try {
      const response = await API.verifyToken();
      const usuario = response.usuario;
      setCurrentUser({
        IdUsuario: usuario.IdUsuario,
        IdPersona: usuario.IdPersona,
        IdTipoUsuario: usuario.IdTipoUsuario,
        Username: usuario.Username,
        Password: '',
        IdEstado: usuario.IdEstado,
      });
      setUserRole(usuario.TipoUsuario?.TipoUsuario as UserRole || null);
      await loadOrdenes();
    } catch (error) {
      API.removeToken();
      setLoading(false);
    }
  };

  const loadOrdenes = async () => {
    try {
      const ordenesData = await API.getOrdenes();
      // Convertir las órdenes del API al formato OrdenCompleta
      const ordenesCompletas: OrdenCompleta[] = ordenesData.map(orden => ({
        IdOrden: orden.IdOrden,
        IdUsuario: orden.IdUsuario,
        IdMesa: orden.IdMesa,
        IdEstado: orden.IdEstado,
        FechaCreacion: orden.FechaCreacion ? new Date(orden.FechaCreacion) : undefined,
        Usuario: orden.Usuario,
        Persona: orden.Usuario?.Persona,
        Mesa: orden.Mesa,
        Estado: orden.Estado,
        Productos: orden.ProductosOrden?.map((po: any) => ({
          IdProducto: po.IdProducto,
          IdOrden: po.IdOrden,
          Cantidad: po.Cantidad,
          Notas: po.Notas,
          Producto: po.Producto,
          TipoProducto: po.Producto?.TipoProducto,
        })) || [],
      }));
      setOrdenes(ordenesCompletas);
    } catch (error) {
      console.error('Error cargando órdenes:', error);
      toast.error('Error al cargar las órdenes');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (usuario: Usuario) => {
    setCurrentUser(usuario);
    // Obtener el tipo de usuario del usuario actual
    const tipoUsuarioMap: Record<number, UserRole> = {
      1: 'Administrador',
      2: 'Mesero',
      3: 'Cocina',
    };
    setUserRole(tipoUsuarioMap[usuario.IdTipoUsuario] || null);
    loadOrdenes();
  };

  const handleLogout = () => {
    API.removeToken();
    setCurrentUser(null);
    setUserRole(null);
    setOrdenes([]);
  };

  const actualizarEstadoOrden = async (idOrden: number, nuevoEstadoId: number) => {
    try {
      await API.updateOrdenEstado(idOrden, nuevoEstadoId);
      await loadOrdenes();
      toast.success('Estado de orden actualizado');
    } catch (error) {
      console.error('Error actualizando orden:', error);
      toast.error('Error al actualizar el estado de la orden');
    }
  };

  const agregarOrden = async (orden: Orden, productos: ProductoOrdenDetalle[]) => {
    try {
      const productosData = productos.map(p => ({
        IdProducto: p.IdProducto,
        Cantidad: p.Cantidad || 1,
        Notas: p.Notas,
      }));

      await API.createOrden({
        IdUsuario: orden.IdUsuario,
        IdMesa: orden.IdMesa,
        IdEstado: orden.IdEstado,
        Productos: productosData,
      });
      
      await loadOrdenes();
      toast.success('Orden creada exitosamente');
    } catch (error) {
      console.error('Error creando orden:', error);
      toast.error('Error al crear la orden');
    }
  };

  const eliminarOrden = async (idOrden: number) => {
    try {
      await API.deleteOrden(idOrden);
      await loadOrdenes();
      toast.success('Orden eliminada exitosamente');
    } catch (error) {
      console.error('Error eliminando orden:', error);
      toast.error('Error al eliminar la orden');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || !userRole) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  return (
    <>
      {userRole === 'Cocina' && (
        <KitchenDashboard
          ordenes={ordenes}
          actualizarEstadoOrden={actualizarEstadoOrden}
          onLogout={handleLogout}
          currentUser={currentUser}
        />
      )}
      {userRole === 'Mesero' && (
        <WaiterDashboard
          ordenes={ordenes}
          agregarOrden={agregarOrden}
          actualizarEstadoOrden={actualizarEstadoOrden}
          onLogout={handleLogout}
          currentUser={currentUser}
        />
      )}
      {userRole === 'Administrador' && (
        <AdminDashboard
          ordenes={ordenes}
          eliminarOrden={eliminarOrden}
          actualizarEstadoOrden={actualizarEstadoOrden}
          onLogout={handleLogout}
          currentUser={currentUser}
        />
      )}
      <Toaster />
    </>
  );
}

export default App;
