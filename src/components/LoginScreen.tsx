import { useState } from 'react';
import { ChefHat, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import type { Usuario } from '../types/database';
import * as DB from '../lib/mockDatabase';

interface LoginScreenProps {
  onLogin: (usuario: Usuario) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Por favor ingresa usuario y contraseña');
      return;
    }

    const usuario = DB.autenticarUsuario(username, password);
    
    if (usuario) {
      onLogin(usuario);
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <ChefHat className="w-16 h-16 text-orange-600" />
          </div>
          <CardTitle className="text-3xl">Sistema de Órdenes</CardTitle>
          <CardDescription>Ingresa tus credenciales para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full">
              <LogIn className="w-4 h-4 mr-2" />
              Iniciar Sesión
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-center mb-3">Usuarios de prueba:</p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between bg-gray-50 p-2 rounded">
                <span>Admin:</span>
                <span>admin / admin123</span>
              </div>
              <div className="flex justify-between bg-gray-50 p-2 rounded">
                <span>Mesero:</span>
                <span>maria / mesero123</span>
              </div>
              <div className="flex justify-between bg-gray-50 p-2 rounded">
                <span>Cocina:</span>
                <span>cocina / cocina123</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
