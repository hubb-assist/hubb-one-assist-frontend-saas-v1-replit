import { useForm } from "react-hook-form";
import { useCreatePatient } from "@/domain/patient/useCases";
import { PatientFormData } from "@/domain/patient/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InputMask from "react-input-mask";
import { useCepAutoComplete } from "@/hooks/useCepAutoComplete";
import { toast } from "sonner";

export function PatientForm() {
  const { register, handleSubmit, setValue, reset, watch } = useForm<PatientFormData>();
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
                <InputMask 
                  mask="999.999.999-99" 
                  {...register("cpf")} 
                  required
                >
                  {(inputProps: any) => (
                    <Input 
                      id="cpf" 
                      placeholder="000.000.000-00" 
                      {...inputProps} 
                    />
                  )}
                </InputMask>
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
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <InputMask 
                  mask="(99) 99999-9999" 
                  {...register("phone")}
                >
                  {(inputProps: any) => (
                    <Input 
                      id="phone" 
                      placeholder="(00) 00000-0000" 
                      {...inputProps} 
                    />
                  )}
                </InputMask>
              </div>
            </div>
            
            <div>
              <Label htmlFor="cep">CEP</Label>
              <InputMask 
                mask="99999-999" 
                {...register("cep")} 
                required
              >
                {(inputProps: any) => (
                  <Input 
                    id="cep" 
                    placeholder="00000-000" 
                    {...inputProps} 
                  />
                )}
              </InputMask>
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