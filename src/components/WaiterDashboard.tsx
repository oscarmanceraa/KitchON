import { useState } from 'react';
import { User, LogOut, Plus, ClipboardList } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import type { OrdenCompleta, Usuario, Orden, ProductoOrdenDetalle } from '../types/database';
import { NewOrderForm } from './NewOrderForm';
import * as DB from '../lib/mockDatabase';

interface WaiterDashboardProps {
  ordenes: OrdenCompleta[];
  agregarOrden: (orden: Orden, productos: ProductoOrdenDetalle[]) => void;
  actualizarEstadoOrden: (idOrden: number, nuevoEstadoId: number) => void;
  onLogout: () => void;
  currentUser: Usuario;
}

export function WaiterDashboard({
  ordenes,
  agregarOrden,
  actualizarEstadoOrden,
  onLogout,
  currentUser,
}: WaiterDashboardProps) {
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('active');

  const persona = DB.getPersona(currentUser.IdPersona);
  const nombreUsuario = persona ? DB.getNombreCompleto(persona) : currentUser.Username;

  // Filtrar órdenes del mesero actual
  const misOrdenes = ordenes.filter(o => o.IdUsuario === currentUser.IdUsuario);
  const ordenesActivas = misOrdenes.filter(o => o.IdEstado !== 5 && o.IdEstado !== 6); // No entregadas ni canceladas
  const ordenesCompletadas = misOrdenes.filter(o => o.IdEstado === 5); // Entregadas

  const handleDeliverOrder = (idOrden: number) => {
    actualizarEstadoOrden(idOrden, 5); // Cambiar a "Entregado"
    toast.success('Orden entregada');
  };

  const formatCurrency = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(valor);
  };

  const getOrderTotal = (orden: OrdenCompleta): number => {
    return orden.Productos?.reduce((total, po) => {
      const precio = po.Producto?.Valor || 0;
      const cantidad = po.Cantidad || 1;
      return total + (precio * cantidad);
    }, 0) || 0;
  };

  const getStatusInfo = (idEstado: number) => {
    const statusMap: Record<number, { label: string; variant: any; color: string }> = {
      2: { label: 'Pendiente', variant: 'secondary', color: 'text-yellow-600' },
      3: { label: 'En Cocina', variant: 'default', color: 'text-blue-600' },
      4: { label: 'Lista', variant: 'default', color: 'text-green-600' },
      5: { label: 'Entregada', variant: 'outline', color: 'text-gray-600' },
      6: { label: 'Cancelada', variant: 'destructive', color: 'text-red-600' },
    };
    return statusMap[idEstado] || statusMap[2];
  };

  const renderOrderCard = (orden: OrdenCompleta) => {
    const statusInfo = getStatusInfo(orden.IdEstado);
    const total = getOrderTotal(orden);

    return (
      <Card key={orden.IdOrden} className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{orden.Mesa?.Mesa || `Mesa ${orden.IdMesa}`}</CardTitle>
              <p className="text-sm text-muted-foreground">Orden #{orden.IdOrden}</p>
            </div>
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {orden.Productos?.map((productoOrden, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>
                  {productoOrden.Cantidad || 1}x {productoOrden.Producto?.NombreProducto}
                </span>
                <span className="text-muted-foreground">
                  {productoOrden.Producto && formatCurrency(productoOrden.Producto.Valor * (productoOrden.Cantidad || 1))}
                </span>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-2">
            <div className="flex justify-between">
              <span>Total:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          {orden.IdEstado === 4 && ( // Si está lista
            <Button
              onClick={() => handleDeliverOrder(orden.IdOrden)}
              className="w-full"
            >
              Marcar como Entregada
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="w-8 h-8 text-blue-600" />
            <div>
              <h1>Panel de Mesero</h1>
              <p className="text-sm text-muted-foreground">{nombreUsuario}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Orden
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Nueva Orden</DialogTitle>
                </DialogHeader>
                <NewOrderForm
                  currentUser={currentUser}
                  onSubmit={(orden, productos) => {
                    agregarOrden(orden, productos);
                    setIsNewOrderOpen(false);
                    toast.success('Orden creada exitosamente');
                  }}
                  onCancel={() => setIsNewOrderOpen(false)}
                />
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="active">
              <ClipboardList className="w-4 h-4 mr-2" />
              Activas ({ordenesActivas.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completadas ({ordenesCompletadas.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {ordenesActivas.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <ClipboardList className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">No tienes órdenes activas</p>
                  <Button onClick={() => setIsNewOrderOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Nueva Orden
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {ordenesActivas.map(renderOrderCard)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {ordenesCompletadas.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">No hay órdenes completadas</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {ordenesCompletadas.map(renderOrderCard)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
