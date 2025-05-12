import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Subscriber } from './types';
import { viaCepService, subscribersService } from '@/lib/api-subscribers';
import { Loader2 } from 'lucide-react';

// Schema para validação do formulário
const subscriberFormSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  document: z.string().min(11, 'CPF/CNPJ inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  zip_code: z.string().min(8, 'CEP inválido'),
  address: z.string().min(3, 'Endereço inválido'),
  number: z.string().min(1, 'Número inválido'),
  city: z.string().min(2, 'Cidade inválida'),
  state: z.string().min(2, 'Estado inválido'),
  is_active: z.boolean().optional(),
  clinic_name: z.string().optional(),
  complement: z.string().optional(),
  district: z.string().optional(),
});

type SubscriberFormValues = z.infer<typeof subscriberFormSchema>;

interface SubscriberEditFormProps {
  subscriber: Subscriber;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function SubscriberEditForm({ subscriber, onSuccess, onCancel }: SubscriberEditFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchingCep, setIsSearchingCep] = useState(false);

  // Inicializar o formulário com os dados do assinante
  const form = useForm<SubscriberFormValues>({
    resolver: zodResolver(subscriberFormSchema),
    defaultValues: {
      name: subscriber.name || '',
      email: subscriber.email || '',
      document: subscriber.document || '',
      phone: subscriber.phone || '',
      zip_code: subscriber.zip_code || '',
      address: subscriber.address || '',
      number: subscriber.number || '',
      city: subscriber.city || '',
      state: subscriber.state || '',
      is_active: subscriber.is_active || false,
      clinic_name: subscriber.clinic_name || '',
      complement: subscriber.complement || '',
      district: subscriber.district || '',
    },
  });

  // Função para lidar com a mudança do CEP e buscar o endereço
  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    
    // Atualizar o valor do CEP no formulário
    form.setValue('zip_code', cep);
    
    // Se o CEP tiver 8 dígitos, buscar o endereço
    if (cep.length === 8) {
      setIsSearchingCep(true);
      try {
        const address = await viaCepService.getAddressByCep(cep);
        if (address) {
          form.setValue('address', address.street);
          form.setValue('city', address.city);
          form.setValue('state', address.state);
          form.setValue('district', address.district || '');
          form.setValue('complement', address.complement || '');
          
          // Foco no campo de número após preencher o endereço
          setTimeout(() => {
            const numberInput = document.querySelector('input[name="number"]') as HTMLInputElement;
            if (numberInput) numberInput.focus();
          }, 100);
        }
      } catch (error) {
        toast.error('Erro ao buscar endereço pelo CEP');
      } finally {
        setIsSearchingCep(false);
      }
    }
  };

  // Função para formatar CPF/CNPJ
  const formatDocument = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      // CPF: 000.000.000-00
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      // CNPJ: 00.000.000/0001-00
      return numbers
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
  };

  // Função para formatar telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      // (00) 0000-0000
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      // (00) 00000-0000
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
  };

  // Handler para envio do formulário
  const onSubmit = async (data: SubscriberFormValues) => {
    setIsLoading(true);
    try {
      // Remover máscaras antes de enviar
      const cleanedData = {
        ...data,
        document: data.document.replace(/\D/g, ''),
        phone: data.phone.replace(/\D/g, ''),
        zip_code: data.zip_code.replace(/\D/g, ''),
      };
      
      await subscribersService.update(subscriber.id, cleanedData);
      toast.success('Assinante atualizado com sucesso!');
      onSuccess();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar assinante';
      toast.error(`Falha ao atualizar: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nome */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="exemplo@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Documento (CPF/CNPJ) */}
          <FormField
            control={form.control}
            name="document"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF/CNPJ</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="000.000.000-00 ou 00.000.000/0001-00" 
                    {...field}
                    value={formatDocument(field.value)}
                    onChange={(e) => {
                      const formattedValue = formatDocument(e.target.value);
                      field.onChange(formattedValue);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Telefone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="(00) 00000-0000" 
                    {...field}
                    value={formatPhone(field.value)}
                    onChange={(e) => {
                      const formattedValue = formatPhone(e.target.value);
                      field.onChange(formattedValue);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* CEP */}
          <FormField
            control={form.control}
            name="zip_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      placeholder="00000-000" 
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleCepChange(e);
                      }}
                    />
                    {isSearchingCep && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nome da Clínica (se aplicável) */}
          <FormField
            control={form.control}
            name="clinic_name"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Nome da Clínica (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Nome da clínica" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Endereço */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input placeholder="Rua, Avenida, etc" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Número */}
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número</FormLabel>
                <FormControl>
                  <Input placeholder="123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Complemento */}
          <FormField
            control={form.control}
            name="complement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Complemento (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Apto, Sala, etc" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bairro */}
          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Bairro" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cidade */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input placeholder="Cidade" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Estado */}
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Input placeholder="UF" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status (Ativo/Inativo) */}
          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-end space-x-3 space-y-0 py-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Ativo</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}