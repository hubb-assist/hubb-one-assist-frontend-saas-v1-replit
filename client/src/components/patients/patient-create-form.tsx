import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { viaCepService } from "@/lib/api-subscribers";
import Spinner from "@/components/ui/spinner";
import { patientsService } from '@/lib/api-patients';
import { PatientFormData } from './types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Schema de validação com Zod
const patientSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  cpf: z.string().length(11, { message: 'CPF deve ter 11 dígitos' }),
  rg: z.string().min(5, { message: 'RG deve ter pelo menos 5 caracteres' }),
  birth_date: z.string().min(1, { message: 'Data de nascimento é obrigatória' }),
  phone: z.string().optional(),
  zip_code: z.string().min(8, { message: 'CEP deve ter 8 dígitos' }),
  street: z.string().min(3, { message: 'Logradouro é obrigatório' }),
  number: z.string().min(1, { message: 'Número é obrigatório' }),
  complement: z.string().optional(),
  district: z.string().min(2, { message: 'Bairro é obrigatório' }),
  city: z.string().min(2, { message: 'Cidade é obrigatória' }),
  state: z.string().length(2, { message: 'Estado deve ter 2 caracteres' }),
});

type FormData = z.infer<typeof patientSchema>;

export default function PatientCreateForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: '',
      cpf: '',
      rg: '',
      birth_date: '',
      phone: '',
      zip_code: '',
      street: '',
      number: '',
      complement: '',
      district: '',
      city: '',
      state: ''
    }
  });

  const { watch, setValue, formState } = form;
  const zipCode = watch('zip_code');
  const isSubmitting = formState.isSubmitting;

  useEffect(() => {
    // Limpar formatação do CEP antes de verificar o comprimento
    const cleanZip = zipCode?.replace(/\D/g, '');
    
    if (cleanZip?.length === 8) {
      // Buscar endereço pelo CEP
      viaCepService.fetchAddressByCep(cleanZip).then(addressData => {
        if (addressData) {
          setValue('street', addressData.street || '');
          setValue('district', addressData.district || '');
          setValue('city', addressData.city || '');
          setValue('state', addressData.state || '');
        } else {
          toast.error('CEP não encontrado');
        }
      });
    }
  }, [zipCode, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      // Remover formatações antes de enviar
      const cleanedData: PatientFormData = {
        ...data,
        cpf: data.cpf.replace(/\D/g, ''),
        zip_code: data.zip_code.replace(/\D/g, '')
      };

      // Enviar para a API
      await patientsService.create(cleanedData);
      
      // Mostrar mensagem de sucesso
      toast.success('Paciente cadastrado com sucesso!');
      
      // Limpar formulário
      form.reset();
    } catch (error: any) {
      console.error('Erro ao cadastrar paciente:', error);
      
      // Mostrar mensagem de erro
      const errorMessage = error.response?.data?.message || 'Erro ao cadastrar paciente';
      toast.error(errorMessage);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Cadastro de Paciente</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dados pessoais */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-lg font-medium">Dados Pessoais</h3>
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite apenas números" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="rg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RG</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o RG" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="birth_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de nascimento</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o telefone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Endereço */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-lg font-medium">Endereço</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="zip_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o CEP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Logradouro</FormLabel>
                          <FormControl>
                            <Input placeholder="Rua, Avenida, etc" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número</FormLabel>
                        <FormControl>
                          <Input placeholder="Nº" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="complement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complemento (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Apto, Bloco, etc" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o bairro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cidade</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite a cidade" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Input placeholder="UF" maxLength={2} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Spinner className="mr-2" /> : null}
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}