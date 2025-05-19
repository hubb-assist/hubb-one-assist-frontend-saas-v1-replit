import { useEffect } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { PatientFormData } from "@/domain/patient/types";

/**
 * Hook para preenchimento automático de endereços via CEP
 * @param watch Função do useForm para observar campo de CEP
 * @param setValue Função do useForm para definir valores nos campos
 */
export function useCepAutoComplete(
  watch: UseFormWatch<PatientFormData>,
  setValue: UseFormSetValue<PatientFormData>
) {
  const cep = watch("cep");

  useEffect(() => {
    const cleanCep = (cep || "").replace(/\D/g, "");

    if (cleanCep.length !== 8) return;

    const fetchAddress = async () => {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();

        if (data.erro) throw new Error("CEP não encontrado");

        setValue("address", data.logradouro);
        setValue("district", data.bairro);
        setValue("city", data.localidade);
        setValue("state", data.uf);
      } catch (e) {
        console.warn("Erro ao buscar endereço via CEP:", e);
      }
    };

    fetchAddress();
  }, [cep, setValue]);
}