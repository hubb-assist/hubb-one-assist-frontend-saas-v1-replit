import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { ModuleFormValues, moduleFormSchema, Module } from './types';

interface ModuleFormProps {
  module?: Module;
  onSubmit: (values: ModuleFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function ModuleForm({ 
  module, 
  onSubmit, 
  onCancel, 
  isSubmitting 
}: ModuleFormProps) {
  // Configurar formulário com validação Zod
  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleFormSchema),
    defaultValues: {
      name: module?.nome || module?.name || '',
      description: module?.descricao || module?.description || '',
      is_active: module?.is_active ?? true,
    },
  });

  const handleSubmit = (data: ModuleFormValues) => {
    onSubmit(data);
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
              <FormLabel>Nome do Módulo</FormLabel>
              <FormControl>
                <Input placeholder="Ex: HUBB HOF" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo de Descrição */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descrição do módulo funcional" 
                  className="resize-none min-h-[100px]" 
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
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
                <FormLabel className="text-base">Ativo</FormLabel>
                <div className="text-sm text-muted-foreground">
                  {field.value ? 'O módulo está ativo e disponível' : 'O módulo está inativo e indisponível'}
                </div>
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

        {/* Botões de Ação */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {module ? 'Salvar Alterações' : 'Criar Módulo'}
          </Button>
        </div>
      </form>
    </Form>
  );
}