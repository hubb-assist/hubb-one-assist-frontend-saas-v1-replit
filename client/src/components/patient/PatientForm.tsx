import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreatePatient } from "@/domain/patient/useCases";
import { PatientFormData } from "@/domain/patient/types";
import { patientSchema } from "@/domain/patient/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCepAutoComplete } from "@/hooks/useCepAutoComplete";
import { toast } from "sonner";
import { formatCpf, formatPhone, formatCep } from "@/utils/masks";

export function PatientForm() {
  const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema)
  });
  const { handleCreate } = useCreatePatient();
  const [loading, setLoading] = useState(false);
  
  // Usar o hook de autopreenchimento de CEP
  useCepAutoComplete(watch, setValue);

  const onSubmit = async (data: PatientFormData) => {
    try {
      setLoading(true);
      await handleCreate(data);
      toast.success("Paciente cadastrado com sucesso!");
      reset(); // Limpa o formulário após o sucesso
    } catch (error) {
      console.error('Erro ao criar paciente:', error);
      toast.error("Erro ao cadastrar paciente. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Cadastro de Paciente</CardTitle>
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
                      e.target.value = formatCpf(e.target.value);
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
                      e.target.value = formatPhone(e.target.value);
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
                    e.target.value = formatCep(e.target.value);
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
          
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Salvando..." : "Salvar Paciente"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}