// Tipo do segmento conforme retornado pela API
export interface Segment {
  id: string;
  name: string;           // Nome vindo da API
  description?: string;   // Descrição vinda da API
  color?: string;         // Cor vinda da API
  is_active: boolean;     // Status de ativo/inativo
  created_at?: string;    // Data de criação (se a API fornecer)
  updated_at?: string;    // Data de atualização (se a API fornecer)
  
  // Mapeamento para os campos em português para compatibilidade com o frontend
  nome?: string;          // Será preenchido pelo adaptador
  descricao?: string;     // Será preenchido pelo adaptador
}

// Tipo para criar ou atualizar um segmento - mantém o formato em português
// para compatibilidade com o formulário atual
export interface SegmentFormValues {
  nome: string;
  descricao?: string;
  is_active: boolean;
}