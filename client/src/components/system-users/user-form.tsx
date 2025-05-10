import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { 
  SystemUser, 
  SystemUserRole, 
  roleLabels,
  systemUserCreateSchema, 
  systemUserUpdateSchema,
  SystemUserCreateValues,
  SystemUserUpdateValues
} from './types';

interface UserFormProps {
  user?: SystemUser;
  onSubmit: (values: SystemUserCreateValues | SystemUserUpdateValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function UserForm({
  user,
  onSubmit,
  onCancel,
  isSubmitting
}: UserFormProps) {
  // Definir o schema correto com base na presença de usuário (edição vs. criação)
  const schema = user ? systemUserUpdateSchema : systemUserCreateSchema;
  
  // Configurar o formulário com React Hook Form e validação Zod
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: user
      ? {
          name: user.name,
          email: user.email,
          role: user.role,
          is_active: user.is_active,
        }
      : {
          name: '',
          email: '',
          password: '',
          role: SystemUserRole.COLABORADOR_NIVEL_2,
          is_active: true,
        },
  });

  // Manipular envio do formulário
  const handleSubmit = (values: any) => {
    console.log("Enviando dados do formulário:", values);
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Campo de Nome */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome do usuário" {...field} />
              </FormControl>
              <FormDescription>
                Nome completo do usuário do sistema.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo de E-mail */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="email@exemplo.com"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                E-mail de contato do usuário.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo de Senha (apenas para criação de novo usuário) */}
        {!user && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="********"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Senha para acesso ao sistema (mínimo 6 caracteres).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Campo de Cargo (Role) */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cargo</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cargo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(roleLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Cargo do usuário determina suas permissões no sistema.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo de Status (Ativo/Inativo) */}
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Status</FormLabel>
                <FormDescription>
                  Usuário está {field.value ? "ativo" : "inativo"} no sistema.
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

        {/* Botões de ação */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {user ? 'Atualizar' : 'Criar'} Usuário
          </Button>
        </div>
      </form>
    </Form>
  );
}