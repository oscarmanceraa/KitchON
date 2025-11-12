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
import type { Usuario, Persona } from '../types/database';
import * as DB from '../lib/mockDatabase';

interface EditUserDialogProps {
  usuario: Usuario | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (usuario: Usuario, persona: Persona) => void;
  isNew?: boolean;
}

export function EditUserDialog({
  usuario,
  isOpen,
  onClose,
  onSave,
  isNew = false,
}: EditUserDialogProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [idTipoUsuario, setIdTipoUsuario] = useState<number>(2);
  const [idEstado, setIdEstado] = useState<number>(1);
  const [primerNombre, setPrimerNombre] = useState('');
  const [segundoNombre, setSegundoNombre] = useState('');
  const [primerApellido, setPrimerApellido] = useState('');
  const [segundoApellido, setSegundoApellido] = useState('');

  useEffect(() => {
    if (usuario && isOpen) {
      const persona = DB.getPersona(usuario.IdPersona);
      setUsername(usuario.Username);
      setPassword(usuario.Password);
      setIdTipoUsuario(usuario.IdTipoUsuario);
      setIdEstado(usuario.IdEstado);
      setPrimerNombre(persona?.PrimerNombre || '');
      setSegundoNombre(persona?.SegundoNombre || '');
      setPrimerApellido(persona?.PrimerApellido || '');
      setSegundoApellido(persona?.SegundoApellido || '');
    } else if (isNew && isOpen) {
      // Reset form for new user
      setUsername('');
      setPassword('');
      setIdTipoUsuario(2);
      setIdEstado(1);
      setPrimerNombre('');
      setSegundoNombre('');
      setPrimerApellido('');
      setSegundoApellido('');
    }
  }, [usuario, isOpen, isNew]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password || !primerNombre || !primerApellido) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    if (isNew) {
      // Crear nueva persona
      const nuevoIdPersona = Math.max(...DB.getPersonas().map(p => p.idPersona), 0) + 1;
      const nuevaPersona: Persona = {
        idPersona: nuevoIdPersona,
        PrimerNombre: primerNombre,
        SegundoNombre: segundoNombre,
        PrimerApellido: primerApellido,
        SegundoApellido: segundoApellido,
      };

      // Crear nuevo usuario
      const nuevoIdUsuario = Math.max(...DB.getUsuarios().map(u => u.IdUsuario), 0) + 1;
      const nuevoUsuario: Usuario = {
        IdUsuario: nuevoIdUsuario,
        IdPersona: nuevoIdPersona,
        IdTipoUsuario: idTipoUsuario,
        Username: username,
        Password: password,
        IdEstado: idEstado,
      };

      onSave(nuevoUsuario, nuevaPersona);
    } else if (usuario) {
      // Actualizar usuario existente
      const usuarioActualizado: Usuario = {
        ...usuario,
        Username: username,
        Password: password,
        IdTipoUsuario: idTipoUsuario,
        IdEstado: idEstado,
      };

      const personaActualizada: Persona = {
        idPersona: usuario.IdPersona,
        PrimerNombre: primerNombre,
        SegundoNombre: segundoNombre,
        PrimerApellido: primerApellido,
        SegundoApellido: segundoApellido,
      };

      onSave(usuarioActualizado, personaActualizada);
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNew ? 'Crear Nuevo Usuario' : 'Editar Usuario'}</DialogTitle>
          <DialogDescription>
            {isNew ? 'Complete el formulario para crear un nuevo usuario en el sistema.' : 'Modifique la información del usuario.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primerNombre">Primer Nombre *</Label>
              <Input
                id="primerNombre"
                value={primerNombre}
                onChange={(e) => setPrimerNombre(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="segundoNombre">Segundo Nombre</Label>
              <Input
                id="segundoNombre"
                value={segundoNombre}
                onChange={(e) => setSegundoNombre(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primerApellido">Primer Apellido *</Label>
              <Input
                id="primerApellido"
                value={primerApellido}
                onChange={(e) => setPrimerApellido(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="segundoApellido">Segundo Apellido</Label>
              <Input
                id="segundoApellido"
                value={segundoApellido}
                onChange={(e) => setSegundoApellido(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario *</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña *</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipoUsuario">Tipo de Usuario *</Label>
              <Select value={idTipoUsuario.toString()} onValueChange={(v) => setIdTipoUsuario(parseInt(v))}>
                <SelectTrigger id="tipoUsuario">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DB.tiposUsuario.map(tipo => (
                    <SelectItem key={tipo.IdTipoUsuario} value={tipo.IdTipoUsuario.toString()}>
                      {tipo.TipoUsuario}
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
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {isNew ? 'Crear' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
