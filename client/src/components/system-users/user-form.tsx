import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

import {
  SystemUser,
  SystemUserCreateValues,
  SystemUserUpdateValues,
  systemUserCreateSchema,
  systemUserUpdateSchema,
  UserRole,
  roleLabels,
} from './types';

interface UserFormProps {
  onSubmit: (values: SystemUserCreateValues | SystemUserUpdateValues) => Promise<void>;
  isLoading: boolean;
  user?: SystemUser;
  onCancel: () => void;
}

export default function UserForm({
  onSubmit,
  isLoading,
  user,
  onCancel,
}: UserFormProps) {
  // Determinar se estamos editando um usuário existente
  const isEditing = !!user;
  
  // Escolher o schema apropriado baseado no modo (criar/editar)
  const formSchema = isEditing
    ? systemUserUpdateSchema
    : systemUserCreateSchema;

  // Inicializar o formulário com os valores padrão
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      password: '', // Sempre vazio ao editar
      role: user?.role || 'USER',
      is_active: user?.is_active ?? true,
    },
  });

  // Função para lidar com o envio do formulário
  async function handleSubmit(values: z.infer<typeof formSchema>) {
    await onSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome do usuário" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="email@exemplo.com" 
                  {...field} 
                  disabled={isEditing} // Email não pode ser alterado após criação
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{isEditing ? 'Nova Senha (opcional)' : 'Senha'}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={isEditing ? 'Deixe em branco para manter a senha atual' : 'Senha do usuário'}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {isEditing 
                  ? 'Deixe em branco para manter a senha atual do usuário.' 
                  : 'Mínimo de 6 caracteres.'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Papel (Role)</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um papel" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(Object.keys(roleLabels) as UserRole[]).map((role) => (
                    <SelectItem key={role} value={role}>
                      {roleLabels[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Define o nível de acesso do usuário no sistema.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Status da conta</FormLabel>
                <FormDescription>
                  Desative para impedir o acesso temporariamente.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Form>
  );
}