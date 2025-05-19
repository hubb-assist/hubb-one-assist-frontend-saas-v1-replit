import { useState } from "react";

interface AddressData {
  address: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
}

/**
 * Hook para buscar endereços via CEP utilizando a API ViaCEP
 * @returns Objeto com funções e estados para busca de CEP
 */
export function useViaCep() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Busca endereço pelo CEP utilizando a API ViaCEP
   * @param cep String com o CEP (pode conter formatação)
   * @returns Objeto com os dados do endereço ou null em caso de erro
   */
  const fetchAddressByCep = async (cep: string): Promise<AddressData | null> => {
    // Limpa mensagens de erro anteriores
    setError(null);
    
    // Remove caracteres não numéricos
    const cleanCep = cep.replace(/\D/g, '');
    
    // Validação básica
    if (cleanCep.length !== 8) {
      setError('CEP deve conter 8 dígitos');
      return null;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      
      // Verifica se o ViaCEP retornou erro
      if (data.erro) {
        setError('CEP não encontrado');
        return null;
      }
      
      // Mapeia a resposta para nossa interface
      const addressData: AddressData = {
        address: data.logradouro,
        complement: data.complemento,
        district: data.bairro,
        city: data.localidade,
        state: data.uf
      };
      
      return addressData;
    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
      setError('Erro ao buscar o endereço. Tente novamente.');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    fetchAddressByCep,
    loading,
    error
  };
}