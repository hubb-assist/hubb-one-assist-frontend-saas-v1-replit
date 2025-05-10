import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { Plus, Minus, Loader2 } from 'lucide-react';
import { NumericFormat } from 'react-number-format';

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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Plan, PlanFormValues, planFormSchema, planModuleSchema } from './types';
import { Segment } from '@/components/segments/types';
import { Module } from '@/components/modules/types';
import { formatCurrency } from '@/lib/utils';

interface PlanFormProps {
  plan?: Plan;
  segments: Segment[];
  modules: Module[];
  onSubmit: (values: PlanFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function PlanForm({
  plan,
  segments,
  modules,
  onSubmit,
  onCancel,
  isSubmitting,
}: PlanFormProps) {
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  
  // Inicializar o formulário com valores padrão ou do plano existente
  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      name: plan?.name || plan?.nome || '',
      segment_id: plan?.segment_id || '',
      base_price: plan?.base_price || 0,
      description: plan?.description || plan?.descricao || '',
      is_active: plan?.is_active ?? true,
      modules: plan?.modules || [],
    },
  });

  // Quando os módulos selecionados mudam, atualizar o formulário
  useEffect(() => {
    const currentModules = form.getValues('modules');
    
    // Para cada módulo selecionado, verificar se já existe no formulário
    const updatedModules = selectedModules.map((moduleId) => {
      const existingModule = currentModules.find((m) => m.module_id === moduleId);
      
      if (existingModule) {
        return existingModule;
      }
      
      // Caso contrário, criar um novo com valores padrão
      return {
        module_id: moduleId,
        custom_price: null,
        trial_days: null,
        is_free: false,
      };
    });
    
    form.setValue('modules', updatedModules);
  }, [selectedModules, form]);

  // Ao carregar o formulário para edição, inicializar os módulos selecionados
  useEffect(() => {
    if (plan?.modules?.length) {
      setSelectedModules(plan.modules.map((m) => m.module_id));
    }
  }, [plan]);

  // Manipular a seleção de módulo
  const handleModuleSelection = (moduleId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedModules((prev) => [...prev, moduleId]);
    } else {
      setSelectedModules((prev) => prev.filter((id) => id !== moduleId));
      // Remover o módulo do formulário
      const currentModules = form.getValues('modules');
      const updatedModules = currentModules.filter((m) => m.module_id !== moduleId);
      form.setValue('modules', updatedModules);
    }
  };

  // Manipular o marcador de módulo gratuito
  const handleFreeModule = (moduleId: string, isFree: boolean) => {
    const currentModules = form.getValues('modules');
    const updatedModules = currentModules.map((m) => {
      if (m.module_id === moduleId) {
        return {
          ...m,
          is_free: isFree,
          custom_price: isFree ? 0 : m.custom_price,
        };
      }
      return m;
    });
    
    form.setValue('modules', updatedModules);
  };

  const handleSubmit = (values: PlanFormValues) => {
    // Verificar se há pelo menos um módulo selecionado
    if (values.modules.length === 0) {
      form.setError('modules', {
        type: 'custom',
        message: 'Selecione pelo menos um módulo para o plano',
      });
      return;
    }

    // Processar valores antes de enviar
    const processedValues = {
      ...values,
      // Mapear módulos para o formato esperado pela API
      modules: values.modules.map((m) => ({
        module_id: m.module_id,
        // A API espera o campo 'price', não 'custom_price'
        price: m.is_free ? 0 : (m.custom_price || 0),
        // Flag is_free é usado apenas no frontend
        is_free: m.is_free === true,
        trial_days: m.trial_days || 0,
      })) as any,
    };

    onSubmit(processedValues);
  };

  // Encontrar o nome do módulo pelo ID
  const getModuleName = (moduleId: string) => {
    const module = modules.find((m) => m.id === moduleId);
    return module?.name || module?.nome || 'Módulo';
  };

  // Verificar se um módulo está selecionado
  const isModuleSelected = (moduleId: string) => {
    return selectedModules.includes(moduleId);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Informações Gerais</TabsTrigger>
            <TabsTrigger value="modules">Módulos</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>
          
          {/* Etapa 1: Informações Gerais */}
          <TabsContent value="info" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Plano</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do plano" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="segment_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Segmento</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um segmento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {segments.map((segment) => (
                          <SelectItem key={segment.id} value={segment.id}>
                            {segment.name || segment.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="base_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço Base</FormLabel>
                  <FormControl>
                    <NumericFormat
                      customInput={Input}
                      thousandSeparator="."
                      decimalSeparator=","
                      decimalScale={2}
                      fixedDecimalScale
                      allowNegative={false}
                      placeholder="0,00"
                      value={field.value}
                      onValueChange={(values) => {
                        const { floatValue } = values;
                        field.onChange(floatValue || 0);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Preço base do plano, sem os módulos adicionais.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrição do plano"
                      className="resize-none"
                      rows={4}
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Descreva os principais recursos do plano.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          
          {/* Etapa 2: Seleção de Módulos */}
          <TabsContent value="modules" className="space-y-4 mt-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Selecione os Módulos</h3>
              <p className="text-sm text-muted-foreground">
                Escolha os módulos que farão parte deste plano e defina suas configurações.
              </p>
            </div>
            
            <div className="space-y-4">
              {/* Lista de módulos disponíveis */}
              <Card>
                <CardHeader>
                  <CardTitle>Módulos Disponíveis</CardTitle>
                  <CardDescription>
                    Selecione os módulos que deseja incluir neste plano.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {modules.filter(m => m.is_active).map((module) => (
                      <div key={module.id} className="flex items-start space-x-2">
                        <Checkbox
                          id={`select-module-${module.id}`}
                          checked={isModuleSelected(module.id)}
                          onCheckedChange={(checked) => 
                            handleModuleSelection(module.id, checked === true)
                          }
                        />
                        <div className="grid w-full gap-1.5">
                          <label
                            htmlFor={`select-module-${module.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {module.name || module.nome}
                          </label>
                          <p className="text-sm text-muted-foreground">
                            {module.description || module.descricao || 'Sem descrição disponível.'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Configuração dos módulos selecionados */}
              {selectedModules.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Configurar Módulos Selecionados</CardTitle>
                    <CardDescription>
                      Configure o preço e período de teste para cada módulo.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {selectedModules.map((moduleId, index) => {
                        const moduleName = getModuleName(moduleId);
                        const moduleConfig = form.getValues('modules').find(m => m.module_id === moduleId);
                        const isFree = moduleConfig?.is_free || false;
                        
                        return (
                          <div key={moduleId} className="border rounded-md p-4">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-medium">{moduleName}</h4>
                            </div>
                            
                            <div className="grid gap-4 md:grid-cols-3">
                              {/* Checkbox para módulo gratuito */}
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`free-module-${moduleId}`}
                                  checked={isFree}
                                  onCheckedChange={(checked) => {
                                    handleFreeModule(moduleId, checked === true);
                                  }}
                                />
                                <label
                                  htmlFor={`free-module-${moduleId}`}
                                  className="text-sm font-medium leading-none"
                                >
                                  Módulo Gratuito
                                </label>
                              </div>
                              
                              {/* Preço personalizado */}
                              <div>
                                <FormField
                                  control={form.control}
                                  name={`modules.${index}.custom_price`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Preço</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="text"
                                          inputMode="numeric"
                                          placeholder="0,00"
                                          disabled={isFree}
                                          {...field}
                                          value={field.value !== null ? String(field.value).replace('.', ',') : ''}
                                          onChange={(e) => {
                                            // Remover caracteres não numéricos exceto vírgula
                                            let value = e.target.value.replace(/[^\d,]/g, '');
                                            
                                            // Se o campo estiver vazio, definir como null
                                            if (!value) {
                                              field.onChange(null);
                                              return;
                                            }
                                            
                                            // Garantir que apenas uma vírgula é usada
                                            const commaCount = (value.match(/,/g) || []).length;
                                            if (commaCount > 1) {
                                              const parts = value.split(',');
                                              value = parts[0] + ',' + parts.slice(1).join('');
                                            }
                                            
                                            // Se o valor tiver vírgula, formatá-lo corretamente para dois decimais
                                            let numericValue = 0;
                                            
                                            if (value.includes(',')) {
                                              // Dividir em parte inteira e parte decimal
                                              let [intPart, decPart] = value.split(',');
                                              
                                              // Garantir sempre dois dígitos decimais
                                              if (decPart.length > 2) {
                                                decPart = decPart.substring(0, 2);
                                              }
                                              
                                              // Se a parte decimal tiver menos de dois dígitos, completar com zeros
                                              if (decPart.length === 1) {
                                                decPart = decPart + '0';
                                              }
                                              
                                              // Converter para número com ponto decimal
                                              const valueWithPoint = intPart + '.' + decPart;
                                              numericValue = parseFloat(valueWithPoint);
                                            } else {
                                              // Se o valor for inteiro, converter para número
                                              numericValue = value ? parseInt(value) : 0;
                                            }
                                            
                                            field.onChange(numericValue);
                                          }}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              {/* Dias de teste */}
                              <div>
                                <FormField
                                  control={form.control}
                                  name={`modules.${index}.trial_days`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Dias de Teste</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          placeholder="0"
                                          min={0}
                                          step={1}
                                          {...field}
                                          value={field.value === null ? '' : field.value}
                                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {selectedModules.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  Selecione pelo menos um módulo para configurar.
                </div>
              )}
              
              {form.formState.errors.modules && (
                <div className="text-destructive text-sm">
                  {form.formState.errors.modules.message}
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Etapa 3: Configurações e Ativação */}
          <TabsContent value="settings" className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Status do Plano
                    </FormLabel>
                    <FormDescription>
                      Ative ou desative este plano para disponibilização.
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
            
            <div className="mt-6">
              <h3 className="text-lg font-medium">Resumo do Plano</h3>
              <div className="mt-2 space-y-2">
                <div className="rounded-md border p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Nome do Plano:</span>
                      <p className="font-medium">{form.watch('name')}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Segmento:</span>
                      <p className="font-medium">
                        {segments.find(s => s.id === form.watch('segment_id'))?.name || 
                         segments.find(s => s.id === form.watch('segment_id'))?.nome || 
                         'Não definido'}
                      </p>
                    </div>
                    
                    {/* Preços */}
                    <div>
                      <span className="text-sm text-muted-foreground">Preço Base:</span>
                      <p className="font-medium">{formatCurrency(form.watch('base_price'))}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Preço Módulos:</span>
                      <p className="font-medium">
                        {formatCurrency(form.watch('modules').reduce((total, module) => 
                          total + (module.is_free ? 0 : (module.custom_price || 0)), 0)
                        )}
                      </p>
                    </div>
                    
                    {/* Preço Total */}
                    <div className="col-span-2 border-t pt-2 mt-2">
                      <span className="text-sm font-medium">Preço Total:</span>
                      <p className="text-lg font-bold text-primary">
                        {formatCurrency(
                          form.watch('base_price') + 
                          form.watch('modules').reduce((total, module) => 
                            total + (module.is_free ? 0 : (module.custom_price || 0)), 0)
                        )}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <p className="font-medium">{form.watch('is_active') ? 'Ativo' : 'Inativo'}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">Módulos Incluídos:</span>
                      <p className="font-medium">{selectedModules.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <Separator />
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {plan ? 'Salvar Alterações' : 'Criar Plano'}
          </Button>
        </div>
      </form>
    </Form>
  );
}