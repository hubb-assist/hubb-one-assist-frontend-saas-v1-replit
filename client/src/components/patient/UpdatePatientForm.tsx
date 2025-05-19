import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdatePatient, useGetPatient } from "@/domain/patient/useCases";
import { PatientFormData } from "@/domain/patient/types";
import { patientSchema } from "@/domain/patient/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InputMask from "react-input-mask";
import { useCepAutoComplete } from "@/hooks/useCepAutoComplete";
import { toast } from "sonner";

interface UpdatePatientFormProps {
  patientId: string;
  onSuccess?: () => void;
}

export function UpdatePatientForm({ patientId, onSuccess }: UpdatePatientFormProps) {
  const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema)
  });
  const { handleUpdate } = useUpdatePatient();
  const { fetchById } = useGetPatient();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Usar hook de autopreenchimento de CEP
  useCepAutoComplete(watch, setValue);
  
  // Carregar dados do paciente
  useEffect(() => {
    async function loadPatient() {
      try {
        setInitialLoading(true);
        const patient = await fetchById(patientId);
        // Preencher o formulário com os dados do paciente
        Object.entries(patient).forEach(([key, value]) => {
          if (key !== 'id' && key !== 'created_at' && key !== 'is_active') {
            setValue(key as keyof PatientFormData, value);
          }
        });
      } catch (error) {
        console.error('Erro ao carregar paciente:', error);
        toast.error("Erro ao carregar dados do paciente");
      } finally {
        setInitialLoading(false);
      }
    }

    if (patientId) {
      loadPatient();
    }
  }, [patientId, fetchById, setValue]);

  const onSubmit = async (data: PatientFormData) => {
    try {
      setLoading(true);
      await handleUpdate(patientId, data);
      toast.success("Paciente atualizado com sucesso!");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao atualizar paciente:', error);
      toast.error("Erro ao atualizar paciente");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Atualizando Paciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">Carregando dados do paciente...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Atualizar Paciente</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" {...register("name")} required placeholder="Nome completo do paciente" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <div className="relative">
                  <Input 
                    id="cpf" 
                    placeholder="000.000.000-00" 
                    {...register("cpf")} 
                    required
                    maxLength={14}
                    onChange={(e) => {
                      // Formatar CPF enquanto digita
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 11) {
                        // Formata como CPF
                        value = value.replace(/(\d{3})(\d)/, '$1.$2');
                        value = value.replace(/(\d{3})(\d)/, '$1.$2');
                        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                        e.target.value = value;
                      }
                    }}
                  />
                  {errors.cpf && (
                    <p className="text-xs text-red-500 mt-1">{errors.cpf.message as string}</p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="rg">RG</Label>
                <Input id="rg" {...register("rg")} placeholder="Número do RG" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="birth_date">Data de Nascimento</Label>
                <Input type="date" id="birth_date" {...register("birth_date")} required />
                {errors.birth_date && (
                  <p className="text-xs text-red-500 mt-1">{errors.birth_date.message as string}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <div className="relative">
                  <Input 
                    id="phone" 
                    placeholder="(00) 00000-0000" 
                    {...register("phone")}
                    maxLength={15}
                    onChange={(e) => {
                      // Formatar telefone enquanto digita
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 11) {
                        // Formata como telefone
                        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                        value = value.replace(/(\d)(\d{4})$/, '$1-$2');
                        e.target.value = value;
                      }
                    }}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">{errors.phone.message as string}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="cep">CEP</Label>
              <div className="relative">
                <Input 
                  id="cep" 
                  placeholder="00000-000" 
                  {...register("cep")} 
                  required
                  maxLength={9}
                  onChange={(e) => {
                    // Formatar CEP enquanto digita
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 8) {
                      // Formata como CEP
                      value = value.replace(/^(\d{5})(\d)/, '$1-$2');
                      e.target.value = value;
                    }
                  }}
                />
                {errors.cep && (
                  <p className="text-xs text-red-500 mt-1">{errors.cep.message as string}</p>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Logradouro</Label>
              <Input id="address" {...register("address")} required placeholder="Rua, Avenida, etc." />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="number">Número</Label>
                <Input id="number" {...register("number")} required placeholder="Nº" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input id="complement" {...register("complement")} placeholder="Apto, Bloco, etc." />
              </div>
            </div>
            
            <div>
              <Label htmlFor="district">Bairro</Label>
              <Input id="district" {...register("district")} required placeholder="Bairro" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" {...register("city")} required placeholder="Cidade" />
              </div>
              <div>
                <Label htmlFor="state">Estado</Label>
                <Input 
                  id="state" 
                  {...register("state")} 
                  required
                  placeholder="UF" 
                  maxLength={2}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => reset()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}