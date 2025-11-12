import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import type { Producto } from '../types/database';
import * as DB from '../lib/mockDatabase';

interface EditProductDialogProps {
  producto: Producto | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (producto: Producto) => void;
  isNew?: boolean;
}

export function EditProductDialog({
  producto,
  isOpen,
  onClose,
  onSave,
  isNew = false,
}: EditProductDialogProps) {
  const [nombreProducto, setNombreProducto] = useState('');
  const [valor, setValor] = useState<number>(0);
  const [idTipoProducto, setIdTipoProducto] = useState<number>(1);
  const [idEstado, setIdEstado] = useState<number>(1);

  useEffect(() => {
    if (producto && isOpen) {
      setNombreProducto(producto.NombreProducto);
      setValor(producto.Valor);
      setIdTipoProducto(producto.IdTipoProducto);
      setIdEstado(producto.IdEstado);
    } else if (isNew && isOpen) {
      setNombreProducto('');
      setValor(0);
      setIdTipoProducto(1);
      setIdEstado(1);
    }
  }, [producto, isOpen, isNew]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombreProducto || valor <= 0) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }

    if (isNew) {
      const nuevoIdProducto = Math.max(...DB.getProductos().map(p => p.IdProducto), 0) + 1;
      const nuevoProducto: Producto = {
        IdProducto: nuevoIdProducto,
        NombreProducto: nombreProducto,
        Valor: valor,
        IdTipoProducto: idTipoProducto,
        IdEstado: idEstado,
      };
      onSave(nuevoProducto);
    } else if (producto) {
      const productoActualizado: Producto = {
        ...producto,
        NombreProducto: nombreProducto,
        Valor: valor,
        IdTipoProducto: idTipoProducto,
        IdEstado: idEstado,
      };
      onSave(productoActualizado);
    }

    onClose();
  };

  const formatCurrency = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(valor);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isNew ? 'Crear Nuevo Producto' : 'Editar Producto'}</DialogTitle>
          <DialogDescription>
            {isNew ? 'Complete el formulario para agregar un nuevo producto al catálogo.' : 'Modifique la información del producto.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombreProducto">Nombre del Producto *</Label>
            <Input
              id="nombreProducto"
              value={nombreProducto}
              onChange={(e) => setNombreProducto(e.target.value)}
              placeholder="Ej: Pizza Margherita"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor">Precio *</Label>
            <Input
              id="valor"
              type="number"
              min="0"
              step="100"
              value={valor}
              onChange={(e) => setValor(parseInt(e.target.value) || 0)}
              placeholder="0"
              required
            />
            {valor > 0 && (
              <p className="text-sm text-muted-foreground">
                Precio: {formatCurrency(valor)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipoProducto">Categoría *</Label>
            <Select value={idTipoProducto.toString()} onValueChange={(v) => setIdTipoProducto(parseInt(v))}>
              <SelectTrigger id="tipoProducto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DB.tiposProducto.map(tipo => (
                  <SelectItem key={tipo.IdTipoProducto} value={tipo.IdTipoProducto.toString()}>
                    {tipo.TipoProducto}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado">Estado *</Label>
            <Select value={idEstado.toString()} onValueChange={(v) => setIdEstado(parseInt(v))}>
              <SelectTrigger id="estado">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Activo</SelectItem>
                <SelectItem value="7">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {isNew ? 'Crear Producto' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
