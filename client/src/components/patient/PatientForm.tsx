import { useForm } from "react-hook-form";
import { useCreatePatient } from "@/domain/patient/useCases";
import { PatientFormData } from "@/domain/patient/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Precisaríamos criar este serviço também
const viaCepService = {
  fetchAddress: async (cep: string) => {
    try {
      // Remover caracteres não numéricos
      const cleanCep = cep.replace(/\D/g, '');
      if (cleanCep.length !== 8) return null;
      
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      
      if (data.erro) return null;
      
      return {
        address: data.logradouro,
        district: data.bairro,
        city: data.localidade,
        state: data.uf
      };
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
      return null;
    }
  }
};

export function PatientForm() {
  const { register, handleSubmit, setValue, reset, watch } = useForm<PatientFormData>();
  const { handleCreate } = useCreatePatient();
  const [loading, setLoading] = useState(false);
  
  const cep = watch('cep');
  
  // Efeito para buscar endereço via CEP
  useEffect(() => {
    if (cep?.length === 8) {
      viaCepService.fetchAddress(cep).then(data => {
        if (data) {
          setValue('address', data.address);
          setValue('district', data.district);
          setValue('city', data.city);
          setValue('state', data.state);
        }
      });
    }
  }, [cep, setValue]);

  const onSubmit = async (data: PatientFormData) => {
    try {
      setLoading(true);
      await handleCreate(data);
      reset(); // Limpa o formulário após o sucesso
    } catch (error) {
      console.error('Erro ao criar paciente:', error);
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
                <Input id="cpf" {...register("cpf")} required placeholder="Somente números" />
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
                <Input id="phone" {...register("phone")} placeholder="(XX) XXXXX-XXXX" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="cep">CEP</Label>
              <Input 
                id="cep" 
                {...register("cep")} 
                required
                placeholder="Somente números"
                maxLength={8}
              />
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