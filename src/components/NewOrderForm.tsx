import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import type { Orden, Usuario, ProductoOrdenDetalle, Producto } from '../types/database';
import * as DB from '../lib/mockDatabase';

interface NewOrderFormProps {
  currentUser: Usuario;
  onSubmit: (orden: Orden, productos: ProductoOrdenDetalle[]) => void;
  onCancel: () => void;
}

interface FormProducto {
  tempId: string;
  IdProducto: number | null;
  Cantidad: number;
  Notas?: string;
}

export function NewOrderForm({ currentUser, onSubmit, onCancel }: NewOrderFormProps) {
  const [idMesa, setIdMesa] = useState<number | null>(null);
  const [items, setItems] = useState<FormProducto[]>([
    { tempId: '1', IdProducto: null, Cantidad: 1, Notas: '' },
  ]);

  const mesas = DB.mesas;
  const productos = DB.productos.filter(p => p.IdEstado === 1); // Solo productos activos
  
  // Agrupar productos por tipo
  const productosPorTipo = productos.reduce((acc, producto) => {
    const tipo = DB.getTipoProducto(producto.IdTipoProducto);
    const nombreTipo = tipo?.TipoProducto || 'Otros';
    if (!acc[nombreTipo]) {
      acc[nombreTipo] = [];
    }
    acc[nombreTipo].push(producto);
    return acc;
  }, {} as Record<string, Producto[]>);

  const addItem = () => {
    setItems([
      ...items,
      { tempId: Date.now().toString(), IdProducto: null, Cantidad: 1, Notas: '' },
    ]);
  };

  const removeItem = (tempId: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.tempId !== tempId));
    }
  };

  const updateItem = (tempId: string, field: keyof FormProducto, value: any) => {
    setItems(items.map(item =>
      item.tempId === tempId ? { ...item, [field]: value } : item
    ));
  };

  const formatCurrency = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(valor);
  };

  const getProducto = (idProducto: number | null): Producto | undefined => {
    if (!idProducto) return undefined;
    return DB.getProducto(idProducto);
  };

  const calculateTotal = (): number => {
    return items.reduce((total, item) => {
      const producto = getProducto(item.IdProducto);
      if (producto) {
        return total + (producto.Valor * item.Cantidad);
      }
      return total;
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validItems = items.filter(item => item.IdProducto !== null && item.Cantidad > 0);
    
    if (!idMesa || validItems.length === 0) {
      alert('Por favor selecciona una mesa y al menos un producto');
      return;
    }

    // Generar nuevo ID para la orden
    const nuevoIdOrden = Math.max(...DB.ordenes.map(o => o.IdOrden), 0) + 1;

    const nuevaOrden: Orden = {
      IdOrden: nuevoIdOrden,
      IdUsuario: currentUser.IdUsuario,
      IdMesa: idMesa,
      IdEstado: 2, // Estado: Pendiente
      FechaCreacion: new Date(),
    };

    const productosOrden: ProductoOrdenDetalle[] = validItems.map(item => ({
      IdProducto: item.IdProducto!,
      IdOrden: nuevoIdOrden,
      Cantidad: item.Cantidad,
      Notas: item.Notas || undefined,
    }));

    onSubmit(nuevaOrden, productosOrden);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="mesa">Mesa *</Label>
        <Select value={idMesa?.toString() || ''} onValueChange={(value) => setIdMesa(parseInt(value))}>
          <SelectTrigger id="mesa">
            <SelectValue placeholder="Seleccionar mesa" />
          </SelectTrigger>
          <SelectContent>
            {mesas.map(mesa => (
              <SelectItem key={mesa.IdMesa} value={mesa.IdMesa.toString()}>
                {mesa.Mesa}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Productos *</Label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Producto
          </Button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => {
            const producto = getProducto(item.IdProducto);
            return (
              <div key={item.tempId} className="border rounded-lg p-4 space-y-3 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Producto {index + 1}</span>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.tempId)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div className="col-span-3 space-y-2">
                    <Label>Producto *</Label>
                    <Select
                      value={item.IdProducto?.toString() || ''}
                      onValueChange={(value) => updateItem(item.tempId, 'IdProducto', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(productosPorTipo).map(([tipo, prods]) => (
                          <div key={tipo}>
                            <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                              {tipo}
                            </div>
                            {prods.map(prod => (
                              <SelectItem key={prod.IdProducto} value={prod.IdProducto.toString()}>
                                {prod.NombreProducto} - {formatCurrency(prod.Valor)}
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Cant. *</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.Cantidad}
                      onChange={(e) => updateItem(item.tempId, 'Cantidad', parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>

                {producto && (
                  <div className="text-sm text-muted-foreground">
                    Subtotal: {formatCurrency(producto.Valor * item.Cantidad)}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Notas especiales</Label>
                  <Input
                    value={item.Notas || ''}
                    onChange={(e) => updateItem(item.tempId, 'Notas', e.target.value)}
                    placeholder="Ej: Sin cebolla, término medio..."
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center text-lg mb-4">
          <span>Total:</span>
          <span>{formatCurrency(calculateTotal())}</span>
        </div>

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={!idMesa || items.every(i => i.IdProducto === null)}>
            Crear Orden
          </Button>
        </div>
      </div>
    </form>
  );
}
