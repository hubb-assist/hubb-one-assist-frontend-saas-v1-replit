import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Subscriber, SubscriberDetail } from './types';
import { subscribersService, viaCepService } from '@/lib/api-subscribers';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SubscriberEditFormProps {
  subscriber: Subscriber | null | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

// Schema de validação para edição de assinante
const subscriberEditSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  document: z.string().min(11, 'CPF/CNPJ inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  clinic_name: z.string().min(3, 'Nome da clínica deve ter pelo menos 3 caracteres'),
  
  // Campos de endereço
  zip_code: z.string().min(8, 'CEP inválido'),
  address: z.string().min(3, 'Endereço inválido'),
  number: z.string().min(1, 'Número inválido'),
  complement: z.string().optional(),
  city: z.string().min(2, 'Cidade inválida'),
  state: z.string().min(2, 'Estado inválido'),
});

type SubscriberFormValues = z.infer<typeof subscriberEditSchema>;

export function SubscriberEditForm({ subscriber, open, onOpenChange, onSuccess }: SubscriberEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [subscriberDetails, setSubscriberDetails] = useState<SubscriberDetail | null>(null);
  
  // Inicializar o formulário com os valores do assinante
  const form = useForm<SubscriberFormValues>({
    resolver: zodResolver(subscriberEditSchema),
    defaultValues: {
      name: '',
      email: '',
      document: '',
      phone: '',
      clinic_name: '',
      zip_code: '',
      address: '',
      number: '',
      complement: '',
      city: '',
      state: '',
    }
  });
  
  // Buscar detalhes do assinante quando o ID mudar
  useEffect(() => {
    if (subscriber) {
      const fetchSubscriberDetails = async () => {
        try {
          const details = await subscribersService.getById(subscriber.id);
          setSubscriberDetails(details);
          
          // Preencher o formulário com os detalhes obtidos
          form.reset({
            name: details.name,
            email: details.email,
            document: details.document,
            phone: details.phone || '',
            clinic_name: details.clinic_name || '',
            zip_code: details.zip_code || '',
            address: typeof details.address === 'string' ? details.address : 
                   details.address?.street || '',
            number: details.number || '',
            complement: details.complement || '',
            city: details.city || '',
            state: details.state || '',
          });
        } catch (error) {
          console.error('Erro ao buscar detalhes do assinante:', error);
          toast.error('Erro ao carregar os detalhes do assinante');
          
          // Usar apenas os dados básicos disponíveis no subscriber
          form.reset({
            name: subscriber.name,
            email: subscriber.email,
            document: subscriber.document,
            phone: '',
            clinic_name: '',
            zip_code: '',
            address: '',
            number: '',
            complement: '',
            city: '',
            state: '',
          });
        }
      };
      
      fetchSubscriberDetails();
    }
  }, [subscriber, form]);
  
  // Função para buscar endereço pelo CEP
  const handleCepBlur = async (cep: string) => {
    if (cep.length >= 8) {
      setIsFetchingAddress(true);
      try {
        const address = await viaCepService.getAddressByCep(cep);
        if (address) {
          form.setValue('address', address.street);
          form.setValue('city', address.city);
          form.setValue('state', address.state);
          if (address.complement) {
            form.setValue('complement', address.complement);
          }
        }
      } catch (error) {
        toast.error('Erro ao buscar endereço pelo CEP');
      } finally {
        setIsFetchingAddress(false);
      }
    }
  };
  
  // Função para formatar o telefone conforme o usuário digita
  const formatPhone = (value: string) => {
    // Remove tudo que não for número
    const onlyNumbers = value.replace(/\D/g, '');
    
    if (onlyNumbers.length <= 10) {
      // Formato (XX) XXXX-XXXX
      return onlyNumbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      // Formato (XX) XXXXX-XXXX
      return onlyNumbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
  };
  
  // Função para formatar CPF/CNPJ conforme o usuário digita
  const formatDocument = (value: string) => {
    // Remove tudo que não for número
    const onlyNumbers = value.replace(/\D/g, '');
    
    if (onlyNumbers.length <= 11) {
      // Formato CPF: XXX.XXX.XXX-XX
      return onlyNumbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1-$2');
    } else {
      // Formato CNPJ: XX.XXX.XXX/XXXX-XX
      return onlyNumbers
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
  };
  
  // Handler para envio do formulário
  const onSubmit = async (values: SubscriberFormValues) => {
    if (!subscriber) return;
    
    setIsSubmitting(true);
    try {
      await subscribersService.update(subscriber.id, values);
      toast.success('Assinante atualizado com sucesso!');
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      let errorMessage = 'Erro ao atualizar assinante';
      
      if (error.response?.data?.message) {
        errorMessage = `Erro: ${error.response.data.message}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Assinante</DialogTitle>
          <DialogDescription>
            Edite as informações do assinante. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        
        {subscriberDetails ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nome completo" />
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
                        <Input {...field} type="email" placeholder="email@exemplo.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="document"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF/CNPJ</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="000.000.000-00"
                          onChange={(e) => {
                            // Atualiza com o valor formatado
                            field.onChange(formatDocument(e.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="(00) 00000-0000"
                          onChange={(e) => {
                            // Atualiza com o valor formatado
                            field.onChange(formatPhone(e.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="clinic_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Clínica</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nome da clínica" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="zip_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            {...field} 
                            placeholder="00000-000"
                            onBlur={(e) => {
                              field.onBlur();
                              handleCepBlur(e.target.value);
                            }}
                          />
                          {isFetchingAddress && (
                            <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-3" />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Rua, Avenida, etc." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Número" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="complement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Apto, Sala, etc." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Cidade" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AC">Acre</SelectItem>
                            <SelectItem value="AL">Alagoas</SelectItem>
                            <SelectItem value="AP">Amapá</SelectItem>
                            <SelectItem value="AM">Amazonas</SelectItem>
                            <SelectItem value="BA">Bahia</SelectItem>
                            <SelectItem value="CE">Ceará</SelectItem>
                            <SelectItem value="DF">Distrito Federal</SelectItem>
                            <SelectItem value="ES">Espírito Santo</SelectItem>
                            <SelectItem value="GO">Goiás</SelectItem>
                            <SelectItem value="MA">Maranhão</SelectItem>
                            <SelectItem value="MT">Mato Grosso</SelectItem>
                            <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                            <SelectItem value="MG">Minas Gerais</SelectItem>
                            <SelectItem value="PA">Pará</SelectItem>
                            <SelectItem value="PB">Paraíba</SelectItem>
                            <SelectItem value="PR">Paraná</SelectItem>
                            <SelectItem value="PE">Pernambuco</SelectItem>
                            <SelectItem value="PI">Piauí</SelectItem>
                            <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                            <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                            <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                            <SelectItem value="RO">Rondônia</SelectItem>
                            <SelectItem value="RR">Roraima</SelectItem>
                            <SelectItem value="SC">Santa Catarina</SelectItem>
                            <SelectItem value="SP">São Paulo</SelectItem>
                            <SelectItem value="SE">Sergipe</SelectItem>
                            <SelectItem value="TO">Tocantins</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar alterações
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="py-10 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <p>Carregando detalhes do assinante...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}