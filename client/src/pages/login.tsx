import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Redirect, useLocation } from 'wouter';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';
import AppSetupLayout from '@/components/layout/app-setup-layout';
import { getDashboardPathByRole } from '@/components/layout/dynamic-app-shell';

// Schema de validação com zod
const loginSchema = z.object({
  email: z.string().email('E-mail inválido').min(1, 'E-mail é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória')
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [, navigate] = useLocation();
  const { login, isAuthenticated, isLoading, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  // Efeito para evitar verificação desnecessária de autenticação na página de login
  useEffect(() => {
    // Definir o documento.title para a página de login
    document.title = "Login | HUBB ONE Assist";
    
    // Remover qualquer toast de erro que possa estar visível
    // Isso evita que mensagens de erro de autenticação apareçam na tela de login
    const toasts = document.querySelectorAll('[data-sonner-toast]');
    toasts.forEach((toast) => {
      if (toast.innerHTML.includes('Erro') || toast.innerHTML.includes('falha')) {
        toast.remove();
      }
    });
  }, []);

  // Configuração do formulário com react-hook-form e validação zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // Estado para rastrear erros de login
  const [loginError, setLoginError] = useState<string | null>(null);

  // Função para fazer login
  const onSubmit = async (data: LoginFormValues) => {
    // Limpar erro anterior
    setLoginError(null);
    
    try {
      console.log(`Tentando login com e-mail: ${data.email}`);
      const success = await login(data.email, data.password);
      
      if (success) {
        toast.success('Login realizado com sucesso!');
        
        // Verificar se há uma URL para redirecionar após o login
        let redirectUrl = sessionStorage.getItem('redirectTo');
        sessionStorage.removeItem('redirectTo');
        
        // Se não houver URL armazenada, determinar com base na role do usuário
        if (!redirectUrl) {
          // Obter o usuário autenticado para verificar a role
          const { user } = useAuth.getState();
          // Convertemos para o tipo esperado pela função
          const userRole = user?.role as any;
          redirectUrl = getDashboardPathByRole(userRole);
        }
        
        // Redirecionar para a página correta
        navigate(redirectUrl);
      } else {
        const errorMsg = 'Credenciais inválidas ou servidor indisponível';
        setLoginError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error: any) {
      console.error('Erro detalhado de login:', error);
      
      // Obter mensagem de erro detalhada
      const errorMsg = error?.response?.data?.message || 
                      error?.message || 
                      'Falha na comunicação com o servidor';
      
      setLoginError(errorMsg);
      toast.error(`Falha ao fazer login: ${errorMsg}`);
    }
  };

  // Se o usuário já estiver autenticado, redirecionar para o dashboard baseado na role
  if (isAuthenticated) {
    const { user } = useAuth();
    if (user) {
      // Convertemos para o tipo esperado pela função
      const userRole = user.role as any;
      const dashboardPath = getDashboardPathByRole(userRole);
      return <Redirect to={dashboardPath} />;
    }
    return <Redirect to="/admin" />;
  }

  return (
    <AppSetupLayout>
      <div className="w-full max-w-md p-4">
        <div className="flex justify-center mb-6">
          <img
            src="https://sq360.com.br/logo-hubb-novo/logo_hubb_assisit.png"
            alt="HUBB Assist Logo"
            className="h-24" // Aumentado para maior visibilidade e destacar no fundo escuro
          />
        </div>
        
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Acesse sua conta</CardTitle>
            <CardDescription className="text-center">
              Entre com seu e-mail e senha para acessar o painel
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...register('email')}
                  className={errors.email ? 'border-red-500' : ''}
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="********"
                    {...register('password')}
                    className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? 'Esconder senha' : 'Mostrar senha'}
                    </span>
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
              </div>
              
              {/* Exibir mensagem de erro, se houver */}
              {loginError && (
                <div className="p-3 rounded bg-red-50 border border-red-200 text-red-600 text-sm mb-2">
                  <p className="font-semibold mb-1">Erro ao fazer login:</p>
                  <p>{loginError}</p>
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90" // Cores destacadas para melhor UX
                disabled={isSubmitting || isLoading}
              >
                {(isSubmitting || isLoading) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Entrar
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col">
            <p className="mt-2 text-center text-sm text-gray-500">
              HUBB ONE Assist - Painel Administrativo
            </p>
          </CardFooter>
        </Card>
      </div>
    </AppSetupLayout>
  );
}