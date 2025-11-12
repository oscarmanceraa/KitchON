import { useState, useEffect } from 'react';
import { ShieldCheck, LogOut, TrendingUp, DollarSign, Clock, Users, Package, Edit, Trash2, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { EditUserDialog } from './EditUserDialog';
import { EditProductDialog } from './EditProductDialog';
import { toast } from 'sonner';
import type { OrdenCompleta, Usuario, Producto, Persona } from '../types/database';
import { getUsuarios, getProductos, createProducto, updateProducto, deleteProducto } from '../lib/api';

interface AdminDashboardProps {
  ordenes: OrdenCompleta[];
  eliminarOrden: (idOrden: number) => void;
  actualizarEstadoOrden: (idOrden: number, nuevoEstadoId: number) => void;
  onLogout: () => void;
  currentUser: Usuario;
}

export function AdminDashboard({
  ordenes,
  eliminarOrden,
  actualizarEstadoOrden,
  onLogout,
  currentUser,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Cargar datos al iniciar
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usuariosData, productosData] = await Promise.all([
        getUsuarios(),
        getProductos(),
      ]);
      setUsuarios(usuariosData as any);
      setProductos(productosData as any);
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };
  
  // Estados para diálogos de edición
  const [editUserDialog, setEditUserDialog] = useState<{ isOpen: boolean; usuario: Usuario | null; isNew: boolean }>({
    isOpen: false,
    usuario: null,
    isNew: false,
  });
  const [editProductDialog, setEditProductDialog] = useState<{ isOpen: boolean; producto: Producto | null; isNew: boolean }>({
    isOpen: false,
    producto: null,
    isNew: false,
  });
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; type: 'user' | 'product' | null; id: number | null }>({
    isOpen: false,
    type: null,
    id: null,
  });

  // Obtener nombre del usuario desde los datos del usuario actual
  const nombreUsuario = currentUser.Username; // Se puede mejorar obteniendo la persona del usuario

  const totalOrders = ordenes.length;
  const activeOrders = ordenes.filter(o => o.IdEstado !== 5 && o.IdEstado !== 6).length;
  const completedToday = ordenes.filter(o => o.IdEstado === 5).length;
  
  const avgPrepTime = ordenes.length > 0
    ? Math.round(ordenes.reduce((acc, order) => {
        if (!order.FechaCreacion) return acc;
        const minutes = Math.floor((Date.now() - order.FechaCreacion.getTime()) / 60000);
        return acc + minutes;
      }, 0) / ordenes.length)
    : 0;

  const totalRevenue = ordenes
    .filter(o => o.IdEstado === 5)
    .reduce((total, orden) => {
      return total + (orden.Productos?.reduce((sum, po) => {
        return sum + ((po.Producto?.Valor || 0) * (po.Cantidad || 1));
      }, 0) || 0);
    }, 0);

  const formatCurrency = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(valor);
  };

  const getStatusInfo = (idEstado: number) => {
    const statusMap: Record<number, { label: string; variant: any; color: string }> = {
      2: { label: 'Pendiente', variant: 'secondary', color: 'bg-yellow-100 text-yellow-800' },
      3: { label: 'En Preparación', variant: 'default', color: 'bg-blue-100 text-blue-800' },
      4: { label: 'Listo', variant: 'default', color: 'bg-green-100 text-green-800' },
      5: { label: 'Entregado', variant: 'outline', color: 'bg-gray-100 text-gray-800' },
      6: { label: 'Cancelado', variant: 'destructive', color: 'bg-red-100 text-red-800' },
    };
    return statusMap[idEstado] || statusMap[2];
  };

  const getTimeElapsed = (date?: Date) => {
    if (!date) return '0 min';
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    return `${minutes} min`;
  };

  const getOrderTotal = (orden: OrdenCompleta): number => {
    return orden.Productos?.reduce((total, po) => {
      const precio = po.Producto?.Valor || 0;
      const cantidad = po.Cantidad || 1;
      return total + (precio * cantidad);
    }, 0) || 0;
  };

  // Handlers para usuarios
  const handleSaveUser = async (usuario: Usuario, persona: Persona) => {
    try {
      // TODO: Implementar endpoints de usuarios en el backend
      toast.info('Funcionalidad de usuarios pendiente de implementar en el backend');
      await loadData();
    } catch (error) {
      console.error('Error guardando usuario:', error);
      toast.error('Error al guardar el usuario');
    }
  };

  const handleDeleteUser = async () => {
    try {
      // TODO: Implementar endpoints de usuarios en el backend
      toast.info('Funcionalidad de usuarios pendiente de implementar en el backend');
      await loadData();
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      toast.error('Error al eliminar el usuario');
    }
  };

  // Handlers para productos
  const handleSaveProduct = async (producto: Producto) => {
    try {
      if (editProductDialog.isNew) {
        await createProducto({
          IdTipoProducto: producto.IdTipoProducto,
          NombreProducto: producto.NombreProducto,
          Valor: producto.Valor,
          IdEstado: producto.IdEstado,
        });
        toast.success('Producto creado exitosamente');
      } else {
        await updateProducto(producto.IdProducto, {
          IdTipoProducto: producto.IdTipoProducto,
          NombreProducto: producto.NombreProducto,
          Valor: producto.Valor,
          IdEstado: producto.IdEstado,
        });
        toast.success('Producto actualizado exitosamente');
      }
      await loadData();
    } catch (error) {
      console.error('Error guardando producto:', error);
      toast.error('Error al guardar el producto');
    }
  };

  const handleDeleteProduct = async () => {
    try {
      if (deleteDialog.id && deleteDialog.type === 'product') {
        await deleteProducto(deleteDialog.id);
        toast.success('Producto eliminado');
        setDeleteDialog({ isOpen: false, type: null, id: null });
        await loadData();
      }
    } catch (error) {
      console.error('Error eliminando producto:', error);
      toast.error('Error al eliminar el producto');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-purple-600" />
            <div>
              <h1>Panel de Administración</h1>
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
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">
              <TrendingUp className="w-4 h-4 mr-2" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="orders">Órdenes</TabsTrigger>
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Total de Órdenes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    Todas las órdenes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Órdenes Activas</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{activeOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    En proceso
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Ingresos Totales</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{formatCurrency(totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground">
                    {completedToday} órdenes completadas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Tiempo Promedio</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{avgPrepTime} min</div>
                  <p className="text-xs text-muted-foreground">
                    Por orden
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Órdenes Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Mesa</TableHead>
                      <TableHead>Mesero</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Tiempo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ordenes.slice(0, 5).map(orden => {
                      const statusInfo = getStatusInfo(orden.IdEstado);
                      return (
                        <TableRow key={orden.IdOrden}>
                          <TableCell className="font-mono text-sm">#{orden.IdOrden}</TableCell>
                          <TableCell>{orden.Mesa?.Mesa}</TableCell>
                          <TableCell>{orden.Persona ? DB.getNombreCompleto(orden.Persona) : 'N/A'}</TableCell>
                          <TableCell>{orden.Productos?.length || 0} items</TableCell>
                          <TableCell>{formatCurrency(getOrderTotal(orden))}</TableCell>
                          <TableCell>
                            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                          </TableCell>
                          <TableCell>{getTimeElapsed(orden.FechaCreacion)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Órdenes</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Mesa</TableHead>
                      <TableHead>Mesero</TableHead>
                      <TableHead>Productos</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Tiempo</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ordenes.map(orden => {
                      const statusInfo = getStatusInfo(orden.IdEstado);
                      return (
                        <TableRow key={orden.IdOrden}>
                          <TableCell className="font-mono text-sm">#{orden.IdOrden}</TableCell>
                          <TableCell>{orden.Mesa?.Mesa}</TableCell>
                          <TableCell>{orden.Persona ? DB.getNombreCompleto(orden.Persona) : 'N/A'}</TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                              {orden.Productos?.map((p, i) => (
                                <div key={i} className="text-sm">
                                  {p.Cantidad}x {p.Producto?.NombreProducto}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(getOrderTotal(orden))}</TableCell>
                          <TableCell>
                            <Select
                              value={orden.IdEstado.toString()}
                              onValueChange={(value) => actualizarEstadoOrden(orden.IdOrden, parseInt(value))}
                            >
                              <SelectTrigger className="w-[150px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="2">Pendiente</SelectItem>
                                <SelectItem value="3">En Preparación</SelectItem>
                                <SelectItem value="4">Listo</SelectItem>
                                <SelectItem value="5">Entregado</SelectItem>
                                <SelectItem value="6">Cancelado</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>{getTimeElapsed(orden.FechaCreacion)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (confirm('¿Estás seguro de eliminar esta orden?')) {
                                  eliminarOrden(orden.IdOrden);
                                  toast.success('Orden eliminada');
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Catálogo de Productos
                  </CardTitle>
                  <Button onClick={() => setEditProductDialog({ isOpen: true, producto: null, isNew: true })}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Producto
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productos.map(producto => {
                      const tipo = DB.getTipoProducto(producto.IdTipoProducto);
                      const estado = DB.getEstado(producto.IdEstado);
                      return (
                        <TableRow key={producto.IdProducto}>
                          <TableCell className="font-mono text-sm">#{producto.IdProducto}</TableCell>
                          <TableCell>{producto.NombreProducto}</TableCell>
                          <TableCell>{tipo?.TipoProducto}</TableCell>
                          <TableCell>{formatCurrency(producto.Valor)}</TableCell>
                          <TableCell>
                            <Badge variant={producto.IdEstado === 1 ? 'default' : 'secondary'}>
                              {estado?.Estado}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditProductDialog({ isOpen: true, producto, isNew: false })}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteDialog({ isOpen: true, type: 'product', id: producto.IdProducto })}
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Usuarios del Sistema
                  </CardTitle>
                  <Button onClick={() => setEditUserDialog({ isOpen: true, usuario: null, isNew: true })}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Usuario
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usuarios.map(usuario => {
                      const persona = DB.getPersona(usuario.IdPersona);
                      const tipo = DB.getTipoUsuario(usuario.IdTipoUsuario);
                      const estado = DB.getEstado(usuario.IdEstado);
                      return (
                        <TableRow key={usuario.IdUsuario}>
                          <TableCell className="font-mono text-sm">#{usuario.IdUsuario}</TableCell>
                          <TableCell>{persona ? DB.getNombreCompleto(persona) : 'N/A'}</TableCell>
                          <TableCell>{usuario.Username}</TableCell>
                          <TableCell>{tipo?.TipoUsuario}</TableCell>
                          <TableCell>
                            <Badge variant={usuario.IdEstado === 1 ? 'default' : 'secondary'}>
                              {estado?.Estado}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditUserDialog({ isOpen: true, usuario, isNew: false })}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteDialog({ isOpen: true, type: 'user', id: usuario.IdUsuario })}
                                disabled={usuario.IdUsuario === currentUser.IdUsuario}
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Diálogos */}
      <EditUserDialog
        usuario={editUserDialog.usuario}
        isOpen={editUserDialog.isOpen}
        onClose={() => setEditUserDialog({ isOpen: false, usuario: null, isNew: false })}
        onSave={handleSaveUser}
        isNew={editUserDialog.isNew}
      />

      <EditProductDialog
        producto={editProductDialog.producto}
        isOpen={editProductDialog.isOpen}
        onClose={() => setEditProductDialog({ isOpen: false, producto: null, isNew: false })}
        onSave={handleSaveProduct}
        isNew={editProductDialog.isNew}
      />

      <AlertDialog open={deleteDialog.isOpen} onOpenChange={(open) => !open && setDeleteDialog({ isOpen: false, type: null, id: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. {deleteDialog.type === 'user' ? 'El usuario' : 'El producto'} será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteDialog.type === 'user' ? handleDeleteUser : handleDeleteProduct}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
