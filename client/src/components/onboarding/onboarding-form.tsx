import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';

import { viaCepService, type SubscriberFormData } from '@/lib/api-subscribers';
import { publicService, type PublicSegment, type PublicPlan, getFallbackSegments, getFallbackPlans } from '@/lib/api-public';

// Schema de validação para a Etapa 1 - Dados do Responsável
const step1Schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  document: z.string().min(1, 'CPF/CNPJ é obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  clinic_name: z.string().min(1, 'Nome da clínica é obrigatório'),
  segment_id: z.string().min(1, 'Segmento é obrigatório'),
});

// Schema de validação para a Etapa 2 - Endereço
const step2Schema = z.object({
  zip_code: z.string().min(1, 'CEP é obrigatório'),
  address: z.string().min(1, 'Endereço é obrigatório'),
  number: z.string().min(1, 'Número é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().min(1, 'Estado é obrigatório'),
});

// Schema de validação para a Etapa 3 - Escolha de Plano
const step3Schema = z.object({
  plan_id: z.string().min(1, 'Selecione um plano'),
});

// Schema de validação para a Etapa 4 - Simulação de Pagamento
const step4Schema = z.object({
  admin_password: z.string().min(1, 'Senha de administrador é obrigatória'),
  terms: z.boolean().refine(val => val === true, {
    message: 'Você precisa aceitar os termos',
  }),
});

// Schema completo combinando todos os steps
const completeSchema = step1Schema.merge(step2Schema).merge(step3Schema).merge(step4Schema);
type FormValues = z.infer<typeof completeSchema>;

export default function OnboardingForm() {
  const [step, setStep] = useState(1);
  const [segments, setSegments] = useState<PublicSegment[]>([]);
  const [plans, setPlans] = useState<PublicPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingCep, setFetchingCep] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [, navigate] = useLocation();
  const [useFallbackData, setUseFallbackData] = useState(false);

  // Formulário completo
  const form = useForm<FormValues>({
    resolver: zodResolver(completeSchema),
    defaultValues: {
      name: '',
      document: '',
      email: '',
      password: '',
      phone: '',
      clinic_name: '',
      segment_id: '',
      zip_code: '',
      address: '',
      number: '',
      city: '',
      state: '',
      plan_id: '',
      admin_password: '',
      terms: false,
    },
  });

  // Carregar segmentos ao iniciar
  useEffect(() => {
    async function loadSegments() {
      try {
        console.log('Tentando carregar segmentos públicos');
        // Tentar carregar da API primeiro
        const data = await publicService.getSegments();
        
        if (data && data.length > 0) {
          console.log('Segmentos públicos carregados com sucesso:', data);
          setSegments(data);
          setUseFallbackData(false);
        } else {
          // Se a API falhar ou retornar vazio, use os dados de fallback
          console.log('Sem dados da API, usando fallback');
          const fallbackData = getFallbackSegments();
          setSegments(fallbackData);
          setUseFallbackData(true);
          toast.warning('Usando dados de demonstração (API indisponível)');
        }
      } catch (error) {
        console.error('Erro ao carregar segmentos:', error);
        // Usar dados de fallback em caso de erro
        const fallbackData = getFallbackSegments();
        setSegments(fallbackData);
        setUseFallbackData(true);
        toast.warning('Usando dados de demonstração (API indisponível)');
      }
    }

    loadSegments();
  }, []);

  // Carregar planos quando o segmento for selecionado
  useEffect(() => {
    async function loadPlans() {
      if (!selectedSegment) return;

      try {
        console.log(`Tentando carregar planos para o segmento ${selectedSegment}`);
        
        if (useFallbackData) {
          // Se estamos usando dados de fallback para segmentos, também usaremos para planos
          console.log('Usando planos de fallback');
          const fallbackData = getFallbackPlans(selectedSegment);
          setPlans(fallbackData);
        } else {
          // Tentar carregar da API
          const data = await publicService.getPlans(selectedSegment);
          
          if (data && data.length > 0) {
            console.log('Planos carregados com sucesso:', data);
            setPlans(data);
          } else {
            // Se a API não retornar planos, usar fallback específico para este segmento
            console.log('Sem planos retornados da API, usando fallback');
            const fallbackData = getFallbackPlans(selectedSegment);
            setPlans(fallbackData);
            toast.warning('Usando planos de demonstração (API indisponível)');
          }
        }
      } catch (error) {
        console.error('Erro ao carregar planos:', error);
        // Usar planos de fallback em caso de erro
        const fallbackData = getFallbackPlans(selectedSegment);
        setPlans(fallbackData);
        toast.warning('Usando planos de demonstração (API indisponível)');
      }
    }

    if (selectedSegment) {
      loadPlans();
    }
  }, [selectedSegment, useFallbackData]);

  // Atualizar segmento selecionado quando mudar no formulário
  useEffect(() => {
    const segmentId = form.watch('segment_id');
    if (segmentId && segmentId !== selectedSegment) {
      setSelectedSegment(segmentId);
    }
  }, [form.watch('segment_id'), selectedSegment]);

  // Buscar endereço pelo CEP
  const handleCepBlur = async () => {
    const cep = form.getValues('zip_code');
    if (cep.length >= 8) {
      setFetchingCep(true);
      try {
        const data = await viaCepService.getAddressByCep(cep);
        if (data) {
          form.setValue('address', data.logradouro);
          form.setValue('city', data.localidade);
          form.setValue('state', data.uf);
          toast.success('CEP encontrado!');
        } else {
          toast.error('CEP não encontrado');
        }
      } catch (error) {
        toast.error('Erro ao buscar CEP');
      } finally {
        setFetchingCep(false);
      }
    }
  };

  // Validação específica por etapa
  const validateCurrentStep = async () => {
    try {
      if (step === 1) {
        await form.trigger(['name', 'document', 'email', 'password', 'phone', 'clinic_name', 'segment_id']);
        const valid = !form.formState.errors.name && 
                     !form.formState.errors.document &&
                     !form.formState.errors.email &&
                     !form.formState.errors.password &&
                     !form.formState.errors.phone &&
                     !form.formState.errors.clinic_name &&
                     !form.formState.errors.segment_id;
        return valid;
      } else if (step === 2) {
        await form.trigger(['zip_code', 'address', 'number', 'city', 'state']);
        const valid = !form.formState.errors.zip_code && 
                     !form.formState.errors.address &&
                     !form.formState.errors.number &&
                     !form.formState.errors.city &&
                     !form.formState.errors.state;
        return valid;
      } else if (step === 3) {
        await form.trigger(['plan_id']);
        return !form.formState.errors.plan_id;
      } else if (step === 4) {
        await form.trigger(['admin_password', 'terms']);
        return !form.formState.errors.admin_password && !form.formState.errors.terms;
      }
      return false;
    } catch (error) {
      console.error('Erro de validação:', error);
      return false;
    }
  };

  // Avançar para a próxima etapa
  const handleNextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      setStep((prev) => Math.min(prev + 1, 4));
    } else {
      // Mostrar mensagem de erro se houver campos inválidos
      toast.error('Por favor, preencha todos os campos obrigatórios corretamente');
    }
  };

  // Voltar para a etapa anterior
  const handlePrevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  // Enviar formulário completo
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      toast('Estamos criando seu sistema, aguarde...', {
        duration: 5000,
      });
      
      const formData: SubscriberFormData = {
        name: data.name,
        clinic_name: data.clinic_name,
        email: data.email,
        phone: data.phone,
        document: data.document,
        zip_code: data.zip_code,
        address: data.address,
        number: data.number,
        city: data.city,
        state: data.state,
        segment_id: data.segment_id,
        plan_id: data.plan_id,
        password: data.password,
        admin_password: data.admin_password,
      };
      
      if (useFallbackData) {
        // Modo de demonstração - simular cadastro bem-sucedido
        console.log('Modo de demonstração: simulando cadastro com sucesso');
        console.log('Dados do formulário:', formData);
        
        // Simulação de tempo de processamento
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        toast.success('Demonstração: conta seria criada com sucesso!');
        navigate('/login');
      } else {
        // Modo real - enviar para API
        await publicService.registerSubscriber(formData);
        toast.success('Assinatura criada com sucesso!');
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Erro ao enviar formulário:', error);
      toast.error(error.response?.data?.message || 'Ocorreu um erro ao criar sua assinatura. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizar etapa atual do formulário
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu nome completo" {...field} />
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
                  <FormLabel>CPF / CNPJ</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu CPF ou CNPJ" {...field} />
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
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu e-mail" type="email" {...field} />
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
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite sua senha" type="password" {...field} />
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
                  <FormLabel>Telefone / WhatsApp</FormLabel>
                  <FormControl>
                    <Input placeholder="(00) 00000-0000" {...field} />
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
                  <FormLabel>Nome da clínica</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome da sua clínica" {...field} />
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
                        <SelectValue placeholder="Selecione o segmento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {segments.map((segment) => (
                        <SelectItem key={segment.id} value={segment.id}>
                          {segment.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="zip_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Input 
                        placeholder="00000-000" 
                        {...field} 
                        onBlur={handleCepBlur} 
                      />
                      {fetchingCep && (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
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
                    <Input placeholder="Rua, Avenida, etc." {...field} />
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
                    <Input placeholder="123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
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
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="plan_id"
              render={({ field }) => (
                <FormItem className="space-y-6">
                  <FormLabel>Selecione seu plano</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="space-y-4"
                    >
                      {plans.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">
                            Não há planos disponíveis para o segmento selecionado.
                          </p>
                        </div>
                      ) : (
                        plans.map((plan) => (
                          <div
                            key={plan.id}
                            className={`border rounded-lg p-4 transition-all ${
                              field.value === plan.id
                                ? 'border-primary bg-primary/5'
                                : 'hover:border-primary/50'
                            }`}
                          >
                            <RadioGroupItem
                              value={plan.id}
                              id={`plan-${plan.id}`}
                              className="hidden"
                            />
                            <Label
                              htmlFor={`plan-${plan.id}`}
                              className="flex flex-col cursor-pointer"
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-lg">
                                  {plan.name}
                                </span>
                                <span className="font-bold text-xl text-primary">
                                  {new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                  }).format(plan.base_price)}
                                </span>
                              </div>
                              <p className="text-muted-foreground mt-2">
                                {plan.description}
                              </p>
                              
                              {plan.modules && plan.modules.length > 0 && (
                                <div className="mt-4">
                                  <p className="text-sm font-medium mb-2">
                                    Módulos incluídos:
                                  </p>
                                  <ul className="text-sm space-y-1">
                                    {plan.modules.map((planModule, index) => (
                                      <li key={index} className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>
                                          {planModule.module_name || `Módulo ${index + 1}`} 
                                          {planModule.is_free ? ' (incluído)' : ''}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </Label>
                          </div>
                        ))
                      )}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
              <h3 className="font-semibold">Resumo da assinatura</h3>
              <dl className="mt-2 space-y-1">
                <div className="flex justify-between">
                  <dt>Nome:</dt>
                  <dd>{form.getValues('name')}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Clínica:</dt>
                  <dd>{form.getValues('clinic_name')}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>E-mail:</dt>
                  <dd>{form.getValues('email')}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Plano:</dt>
                  <dd>{plans.find(p => p.id === form.getValues('plan_id'))?.name || 'Plano selecionado'}</dd>
                </div>
              </dl>
            </div>
            
            <FormField
              control={form.control}
              name="admin_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha para administração</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Digite a senha para usuário administrador" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value as unknown as boolean}
                      onChange={field.onChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Li e aceito os termos de uso e política de privacidade
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Indicador de progresso
  const progressPercentage = (step / 4) * 100;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Cadastro no HUBB ONE Assist</CardTitle>
                <CardDescription>Preencha o formulário para criar sua conta</CardDescription>
              </div>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-12 rounded-full ${
                      index < step ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="mb-6">
              <h3 className="text-lg font-medium">
                {step === 1 && 'Dados do Responsável'}
                {step === 2 && 'Endereço'}
                {step === 3 && 'Escolha de Plano'} 
                {step === 4 && 'Finalizar Cadastro'}
              </h3>
            </div>
            
            {renderStep()}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            {step > 1 ? (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handlePrevStep}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            ) : (
              <div />
            )}
            
            {step < 4 ? (
              <Button 
                type="button" 
                onClick={handleNextStep}
              >
                Próximo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Criar conta
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}