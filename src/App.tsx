import { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { KitchenDashboard } from './components/KitchenDashboard';
import { WaiterDashboard } from './components/WaiterDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Toaster } from './components/ui/sonner';
import type { Usuario, Orden, OrdenCompleta, ProductoOrdenDetalle } from './types/database';
import * as DB from './lib/mockDatabase';

export type UserRole = 'Cocina' | 'Mesero' | 'Administrador' | null;

function App() {
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [ordenes, setOrdenes] = useState<Orden[]>(DB.getOrdenes());

  // Actualizar el estado local cuando cambian las órdenes
  useEffect(() => {
    DB.setOrdenes(ordenes);
  }, [ordenes]);

  const handleLogin = (usuario: Usuario) => {
    setCurrentUser(usuario);
    const tipoUsuario = DB.getTipoUsuario(usuario.IdTipoUsuario);
    setUserRole(tipoUsuario?.TipoUsuario as UserRole || null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserRole(null);
  };

  const actualizarEstadoOrden = (idOrden: number, nuevoEstadoId: number) => {
    setOrdenes(ordenes.map(orden => 
      orden.IdOrden === idOrden ? { ...orden, IdEstado: nuevoEstadoId } : orden
    ));
  };

  const agregarOrden = (orden: Orden, productos: ProductoOrdenDetalle[]) => {
    // Agregar la orden
    setOrdenes([...ordenes, orden]);
    
    // Agregar los productos de la orden
    const productosOrden = productos.map(p => ({
      IdProducto: p.IdProducto,
      IdOrden: orden.IdOrden,
      Cantidad: p.Cantidad,
      Notas: p.Notas,
    }));
    DB.agregarProductosOrden(productosOrden);
  };

  const eliminarOrden = (idOrden: number) => {
    setOrdenes(ordenes.filter(orden => orden.IdOrden !== idOrden));
    // También eliminar los productos asociados
    DB.eliminarProductosDeOrden(idOrden);
  };

  // Función para obtener órdenes completas con toda la información
  const getOrdenesCompletas = (): OrdenCompleta[] => {
    return ordenes.map(orden => {
      const usuario = DB.getUsuario(orden.IdUsuario);
      const persona = usuario ? DB.getPersona(usuario.IdPersona) : undefined;
      const mesa = DB.getMesa(orden.IdMesa);
      const estado = DB.getEstado(orden.IdEstado);
      const productosOrden = DB.getProductosDeOrden(orden.IdOrden);
      
      const productos: ProductoOrdenDetalle[] = productosOrden.map(po => {
        const producto = DB.getProducto(po.IdProducto);
        const tipoProducto = producto ? DB.getTipoProducto(producto.IdTipoProducto) : undefined;
        return {
          ...po,
          Producto: producto,
          TipoProducto: tipoProducto,
        };
      });

      return {
        ...orden,
        Usuario: usuario,
        Persona: persona,
        Mesa: mesa,
        Estado: estado,
        Productos: productos,
      };
    });
  };

  if (!currentUser || !userRole) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  const ordenesCompletas = getOrdenesCompletas();

  return (
    <>
      {userRole === 'Cocina' && (
        <KitchenDashboard
          ordenes={ordenesCompletas}
          actualizarEstadoOrden={actualizarEstadoOrden}
          onLogout={handleLogout}
          currentUser={currentUser}
        />
      )}
      {userRole === 'Mesero' && (
        <WaiterDashboard
          ordenes={ordenesCompletas}
          agregarOrden={agregarOrden}
          actualizarEstadoOrden={actualizarEstadoOrden}
          onLogout={handleLogout}
          currentUser={currentUser}
        />
      )}
      {userRole === 'Administrador' && (
        <AdminDashboard
          ordenes={ordenesCompletas}
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
