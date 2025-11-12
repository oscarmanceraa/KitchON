import { useState } from 'react';
import { ChefHat, LogOut, Clock, Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';
import type { OrdenCompleta, Usuario } from '../types/database';
import * as DB from '../lib/mockDatabase';

interface KitchenDashboardProps {
  ordenes: OrdenCompleta[];
  actualizarEstadoOrden: (idOrden: number, nuevoEstadoId: number) => void;
  onLogout: () => void;
  currentUser: Usuario;
}

export function KitchenDashboard({
  ordenes,
  actualizarEstadoOrden,
  onLogout,
  currentUser,
}: KitchenDashboardProps) {
  const [activeTab, setActiveTab] = useState('pending');

  // Estados: 2=Pendiente, 3=En Preparación, 4=Listo, 5=Entregado
  const pendingOrders = ordenes.filter(o => o.IdEstado === 2);
  const preparingOrders = ordenes.filter(o => o.IdEstado === 3);
  const readyOrders = ordenes.filter(o => o.IdEstado === 4);

  const persona = DB.getPersona(currentUser.IdPersona);
  const nombreUsuario = persona ? DB.getNombreCompleto(persona) : currentUser.Username;

  const handleStartOrder = (idOrden: number) => {
    actualizarEstadoOrden(idOrden, 3); // Cambiar a "En Preparación"
    toast.success('Orden iniciada');
  };

  const handleCompleteOrder = (idOrden: number) => {
    actualizarEstadoOrden(idOrden, 4); // Cambiar a "Listo"
    toast.success('Orden completada');
  };

  const getTimeElapsed = (date?: Date) => {
    if (!date) return '0 min';
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    return `${minutes} min`;
  };

  const formatCurrency = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(valor);
  };

  const renderOrderCard = (orden: OrdenCompleta) => (
    <Card key={orden.IdOrden} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {orden.Mesa?.Mesa || `Mesa ${orden.IdMesa}`}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Mesero: {orden.Persona ? DB.getNombreCompleto(orden.Persona) : 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground">
              Orden #{orden.IdOrden}
            </p>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {getTimeElapsed(orden.FechaCreacion)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {orden.Productos?.map((productoOrden, idx) => (
            <div key={idx} className="border-b pb-2 last:border-0">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p>
                    <span className="font-medium">{productoOrden.Cantidad || 1}x</span>{' '}
                    {productoOrden.Producto?.NombreProducto}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {productoOrden.TipoProducto?.TipoProducto}
                  </p>
                  {productoOrden.Notas && (
                    <p className="text-sm text-orange-600 mt-1">Nota: {productoOrden.Notas}</p>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {productoOrden.Producto && formatCurrency(productoOrden.Producto.Valor)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          {orden.IdEstado === 2 && (
            <Button
              onClick={() => handleStartOrder(orden.IdOrden)}
              className="w-full"
            >
              Iniciar Preparación
            </Button>
          )}
          {orden.IdEstado === 3 && (
            <Button
              onClick={() => handleCompleteOrder(orden.IdOrden)}
              className="w-full"
              variant="default"
            >
              Marcar como Lista
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChefHat className="w-8 h-8 text-orange-600" />
            <div>
              <h1>Panel de Cocina</h1>
              <p className="text-sm text-muted-foreground">{nombreUsuario}</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Salir
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="pending" className="relative">
              Pendientes
              {pendingOrders.length > 0 && (
                <Badge className="ml-2" variant="destructive">
                  {pendingOrders.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="preparing">
              En Preparación
              {preparingOrders.length > 0 && (
                <Badge className="ml-2">{preparingOrders.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="ready">
              Listas
              {readyOrders.length > 0 && (
                <Badge className="ml-2">{readyOrders.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingOrders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No hay órdenes pendientes</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pendingOrders.map(renderOrderCard)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="preparing" className="space-y-4">
            {preparingOrders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <ChefHat className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No hay órdenes en preparación</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {preparingOrders.map(renderOrderCard)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="ready" className="space-y-4">
            {readyOrders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">No hay órdenes listas</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {readyOrders.map(renderOrderCard)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
