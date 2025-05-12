import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useLocation } from 'wouter';
import InputMask from 'react-input-mask';

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
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { DocumentInput, PhoneInput, CEPInput } from '@/components/ui/masked-input';

import { viaCepService, type SubscriberFormData } from '@/lib/api-subscribers';
import { publicService, type PublicSegment, type PublicPlan } from '@/lib/api-public';

// Funções para validação de CPF e CNPJ
const isValidCPF = (cpf: string) => {
  const cleanCPF = cpf.replace(/\D/g, '');
  if (cleanCPF.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais (caso inválido)
  if (/^(\d)\1+$/.test(cleanCPF)) return false;
  
  // Cálculo do dígito verificador
  let sum = 0;
  let remainder;
  
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;
  
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;
  
  return true;
};

const isValidCNPJ = (cnpj: string) => {
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  if (cleanCNPJ.length !== 14) return false;
  
  // Verifica se todos os dígitos são iguais (caso inválido)
  if (/^(\d)\1+$/.test(cleanCNPJ)) return false;
  
  // Cálculo do primeiro dígito verificador
  let size = cleanCNPJ.length - 2;
  let numbers = cleanCNPJ.substring(0, size);
  const digits = cleanCNPJ.substring(size);
  let sum = 0;
  let pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;
  
  // Cálculo do segundo dígito verificador
  size = size + 1;
  numbers = cleanCNPJ.substring(0, size);
  sum = 0;
  pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;
  
  return true;
};

// Schema de validação para a Etapa 1 - Dados do Responsável
const step1Schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').min(3, 'Nome deve ter pelo menos 3 caracteres'),
  
  document: z.string()
    .min(1, 'CPF/CNPJ é obrigatório')
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, '');
        if (digits.length === 11) return isValidCPF(val);
        if (digits.length === 14) return isValidCNPJ(val);
        return false;
      },
      { message: 'CPF/CNPJ inválido' }
    ),
    
  email: z.string()
    .min(1, 'E-mail é obrigatório')
    .email('E-mail inválido'),
    
  phone: z.string()
    .min(1, 'Telefone é obrigatório')
    .refine(
      (val) => val.replace(/\D/g, '').length >= 10,
      { message: 'Telefone deve ter pelo menos 10 dígitos' }
    ),
    
  clinic_name: z.string()
    .min(1, 'Nome da clínica é obrigatório')
    .min(3, 'Nome da clínica deve ter pelo menos 3 caracteres'),
    
  segment_id: z.string()
    .min(1, 'Segmento é obrigatório'),
});

// Schema de validação para a Etapa 2 - Endereço
const step2Schema = z.object({
  zip_code: z.string()
    .min(1, 'CEP é obrigatório')
    .refine(
      (val) => val.replace(/\D/g, '').length === 8,
      { message: 'CEP deve ter 8 dígitos' }
    ),
    
  address: z.string()
    .min(1, 'Endereço é obrigatório')
    .min(3, 'Endereço deve ter pelo menos 3 caracteres'),
    
  number: z.string()
    .min(1, 'Número é obrigatório'),
    
  city: z.string()
    .min(1, 'Cidade é obrigatória')
    .min(2, 'Cidade deve ter pelo menos 2 caracteres'),
    
  state: z.string()
    .min(1, 'Estado é obrigatório')
    .min(2, 'Estado deve ter pelo menos 2 caracteres'),
});

// Schema de validação para a Etapa 3 - Escolha de Plano
const step3Schema = z.object({
  plan_id: z.string().min(1, 'Selecione um plano'),
});

// Schema de validação para a Etapa 4 - Simulação de Pagamento
const step4Schema = z.object({
  password: z.string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
  
  password_confirmation: z.string()
    .min(1, 'Confirmação de senha é obrigatória'),
    
  terms: z.boolean().refine(val => val === true, {
    message: 'Você precisa aceitar os termos',
  }),
}).superRefine((data, ctx) => {
  if (data.password !== data.password_confirmation) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "As senhas não coincidem",
      path: ["password_confirmation"],
    });
  }
});

// Schema completo combinando todos os steps
const completeSchema = step1Schema.merge(step2Schema).merge(step3Schema).merge(z.object({
  password: z.string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
  
  password_confirmation: z.string()
    .min(1, 'Confirmação de senha é obrigatória'),
    
  terms: z.boolean().refine(val => val === true, {
    message: 'Você precisa aceitar os termos',
  }),
})).refine((data) => data.password === data.password_confirmation, {
  message: "As senhas não coincidem",
  path: ["password_confirmation"],
});
type FormValues = z.infer<typeof completeSchema>;

export default function OnboardingForm() {
  const [step, setStep] = useState(1);
  const [segments, setSegments] = useState<PublicSegment[]>([]);
  const [plans, setPlans] = useState<PublicPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingCep, setFetchingCep] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [, navigate] = useLocation();
  const [apiError, setApiError] = useState<string | null>(null);

  // Formulário completo
  const form = useForm<FormValues>({
    resolver: zodResolver(completeSchema),
    shouldUnregister: true, // Importante: garantir que campos removidos do DOM sejam desregistrados
    defaultValues: {
      name: '',
      document: '',
      email: '',
      phone: '',
      clinic_name: '',
      segment_id: '',
      zip_code: '',
      address: '',
      number: '',
      city: '',
      state: '',
      plan_id: '',
      password: '',
      password_confirmation: '',
      terms: false,
    },
  });

  // Carregar segmentos ao iniciar
  useEffect(() => {
    async function loadSegments() {
      setIsLoading(true);
      setApiError(null);
      
      try {
        console.log('Tentando carregar segmentos públicos');
        const data = await publicService.getSegments();
        
        if (data && data.length > 0) {
          console.log('Segmentos públicos carregados com sucesso:', data);
          setSegments(data);
        } else {
          console.log('API retornou lista vazia de segmentos');
          setApiError('Não há segmentos disponíveis no momento. Por favor, tente novamente mais tarde.');
          toast.error('Não há segmentos disponíveis no momento');
        }
      } catch (error) {
        console.error('Erro ao carregar segmentos:', error);
        const errorMessage = 'Não foi possível acessar a API de segmentos. Por favor, informe ao suporte técnico sobre o erro 404 na rota /public/segments.';
        setApiError(errorMessage);
        toast.error('API de segmentos indisponível');
      } finally {
        setIsLoading(false);
      }
    }

    loadSegments();
  }, []);

  // Resetar campos da etapa 2 quando mudar para essa etapa
  useEffect(() => {
    if (step === 2) {
      console.log('Resetando campos da etapa 2...');
      form.reset({
        ...form.getValues(), // Manter valores existentes de outros campos
        zip_code: '',        // Limpar campos específicos da etapa 2
        address: '',
        number: '',
        city: '',
        state: ''
      });
    }
  }, [step, form]);
  
  // Carregar planos quando o segmento for selecionado
  useEffect(() => {
    async function loadPlans() {
      if (!selectedSegment) return;

      setIsLoading(true);
      setApiError(null);
      setPlans([]);
      
      try {
        console.log(`Tentando carregar planos para o segmento ${selectedSegment}`);
        
        // Tentar carregar da API
        const data = await publicService.getPlans(selectedSegment);
        
        if (data && data.length > 0) {
          console.log('Planos carregados com sucesso:', data);
          setPlans(data);
        } else {
          console.log('API retornou lista vazia de planos');
          setApiError(`Não há planos disponíveis para o segmento selecionado. Por favor, escolha outro segmento ou tente mais tarde.`);
          toast.warning('Não há planos disponíveis para este segmento');
        }
      } catch (error) {
        console.error('Erro ao carregar planos:', error);
        const errorMessage = 'Não foi possível acessar a API de planos. Por favor, informe ao suporte técnico sobre o erro 404 na rota /public/plans.';
        setApiError(errorMessage);
        toast.error('API de planos indisponível');
      } finally {
        setIsLoading(false);
      }
    }

    if (selectedSegment) {
      loadPlans();
    }
  }, [selectedSegment]);

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
    // Limpar o CEP para garantir que só contém números
    const cleanCep = cep.replace(/\D/g, '');
    
    // Verificação melhorada do CEP
    if (cleanCep.length >= 8) {
      setFetchingCep(true);
      try {
        console.log('Buscando CEP:', cleanCep);
        const data = await viaCepService.getAddressByCep(cleanCep);
        if (data) {
          form.setValue('address', data.logradouro || '');
          form.setValue('city', data.localidade || '');
          form.setValue('state', data.uf || '');
          toast.success('CEP encontrado!');
        } else {
          toast.error('CEP não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        toast.error('Erro ao buscar CEP. Verifique se o formato está correto (99999-999)');
      } finally {
        setFetchingCep(false);
      }
    } else if (cep.length > 0) {
      // Avisar quando o CEP está incompleto
      toast.warning('CEP deve ter 8 dígitos');
    }
  };

  // Monitorar mudança de step para realizar tarefas específicas
  useEffect(() => {
    // Garantir que os dados do resumo na etapa 4 estejam atualizados
    if (step === 4) {
      // Forçar atualização dos valores para exibição no resumo
      console.log('[DEBUG] Dados do formulário na etapa 4:', form.getValues());
      
      // Verificar se os dados estão completos antes de mostrar o resumo
      const formValues = form.getValues();
      const hasMissingData = !formValues.name || !formValues.email || !formValues.plan_id;
      
      if (hasMissingData) {
        console.log('[DEBUG] Dados incompletos, retornando para etapa 1');
        setStep(1);
        toast.error('Por favor, preencha todos os dados antes de finalizar o cadastro.');
      } else {
        form.trigger();
      }
    }
  }, [step, form]);

  // Validação específica por etapa
  const validateCurrentStep = async () => {
    try {
      if (step === 1) {
        await form.trigger(['name', 'document', 'email', 'phone', 'clinic_name', 'segment_id']);
        const valid = !form.formState.errors.name && 
                     !form.formState.errors.document &&
                     !form.formState.errors.email &&
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
        await form.trigger(['password', 'password_confirmation', 'terms']);
        return !form.formState.errors.password && 
               !form.formState.errors.password_confirmation && 
               !form.formState.errors.terms;
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
    console.log('[DEBUG] Submissão iniciada:', data);
    console.log('[DEBUG] Valor do terms:', data.terms);
    console.log('[DEBUG] Formulário válido?', form.formState.isValid);
    
    // Verificar se estamos na última etapa e se os campos obrigatórios estão preenchidos
    const isLastStepValid = await validateCurrentStep();
    if (!isLastStepValid) {
      toast.error('Por favor, preencha todos os campos obrigatórios antes de enviar o formulário.');
      return;
    }
    
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
        admin_password: data.password, // Usar a mesma senha para admin
      };
      
      console.log('Enviando dados para API:', formData);
      const response = await publicService.registerSubscriber(formData);
      console.log('Resposta da API:', response);
      
      toast.success('Assinatura criada com sucesso!');
      // Redirecionamento para a página de login após o registro
      navigate('/login');
    } catch (error: any) {
      console.error('Erro ao registrar assinante:', error);
      const errorMessage = error.response?.data?.message || 
                         'Não foi possível completar o cadastro. Por favor, tente novamente mais tarde.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizar etapa atual do formulário
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4" key="step-1-form">
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
                    <DocumentInput 
                      placeholder="Digite seu CPF ou CNPJ" 
                      {...field} 
                    />
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
            
            {/* Campo de senha removido do passo 1 e movido para o passo 4 */}
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone / WhatsApp</FormLabel>
                  <FormControl>
                    <PhoneInput placeholder="(00) 00000-0000" {...field} />
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
          <div className="space-y-4" key="step-2-form">
            <FormField
              control={form.control}
              name="zip_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <CEPInput
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
          <div className="space-y-6" key="step-3-form">
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
        // Obter todos os valores atuais do formulário de uma só vez
        const allFormValues = form.getValues();
        console.log('[DEBUG] Valores completos do formulário na etapa 4:', allFormValues);
        
        // Buscar o plano selecionado
        const selectedPlan = plans.find(p => p.id === allFormValues.plan_id);
        console.log('[DEBUG] Plano selecionado:', selectedPlan);
        
        return (
          <div className="space-y-6">
            {/* Debug - Valores do formulário */}
            <div className="bg-amber-50 p-2 mb-4 text-xs rounded border border-amber-200">
              <p className="font-mono">DEBUG: Dados capturados do formulário</p>
              <pre className="mt-1 overflow-auto max-h-24">{JSON.stringify(allFormValues, null, 2)}</pre>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
              <h3 className="font-semibold">Resumo da assinatura</h3>
              <dl className="mt-2 space-y-1">
                <div className="flex justify-between py-1 border-b border-green-100">
                  <dt className="font-medium">Nome:</dt>
                  <dd className="font-semibold">{allFormValues.name || '-'}</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-green-100">
                  <dt className="font-medium">Clínica:</dt>
                  <dd className="font-semibold">{allFormValues.clinic_name || '-'}</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-green-100">
                  <dt className="font-medium">E-mail:</dt>
                  <dd className="font-semibold">{allFormValues.email || '-'}</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-green-100">
                  <dt className="font-medium">Telefone:</dt>
                  <dd className="font-semibold">{allFormValues.phone || '-'}</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-green-100">
                  <dt className="font-medium">Documento:</dt>
                  <dd className="font-semibold">{allFormValues.document || '-'}</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-green-100">
                  <dt className="font-medium">Endereço:</dt>
                  <dd className="font-semibold">{`${allFormValues.address || '-'}, ${allFormValues.number || '-'}`}</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-green-100">
                  <dt className="font-medium">Cidade/UF:</dt>
                  <dd className="font-semibold">{`${allFormValues.city || '-'}/${allFormValues.state || '-'}`}</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-green-100">
                  <dt className="font-medium">Plano:</dt>
                  <dd className="font-semibold">{selectedPlan?.name || 'Plano selecionado'}</dd>
                </div>
                <div className="flex justify-between font-medium py-1">
                  <dt className="font-medium">Preço:</dt>
                  <dd className="text-green-700 font-bold text-base">R$ {selectedPlan?.base_price?.toFixed(2) || '0,00'}</dd>
                </div>
              </dl>
            </div>
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha de acesso</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className="absolute right-1 top-1 h-7 w-7 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Ocultar senha" : "Mostrar senha"}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirme sua senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPasswordConfirmation ? "text" : "password"}
                        placeholder="Confirme sua senha"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className="absolute right-1 top-1 h-7 w-7 p-0"
                        onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                      >
                        {showPasswordConfirmation ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showPasswordConfirmation ? "Ocultar senha" : "Mostrar senha"}
                        </span>
                      </Button>
                    </div>
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
                      onChange={(e) => {
                        field.onChange(e);
                        console.log('Terms checkbox alterado para:', e.target.checked);
                      }}
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
            
            {/* Debug checkbox terms */}
            <div className="mt-2 text-xs text-muted-foreground">
              TERMS CHECKED? {form.watch('terms') ? '✔️' : '❌'}
            </div>
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
              
              {apiError && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded" role="alert">
                  <div className="flex">
                    <div className="py-1">
                      <svg className="w-6 h-6 mr-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold">Não foi possível carregar os dados</p>
                      <p className="text-sm">{apiError}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {!apiError && renderStep()}
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
                onClick={() => {
                  console.log('[DEBUG] Botão Criar conta clicado');
                  console.log('[DEBUG] Form válido:', form.formState.isValid);
                  console.log('[DEBUG] Terms checked:', form.getValues('terms'));
                }}
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