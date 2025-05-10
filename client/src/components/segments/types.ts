// Tipo do segmento
export interface Segment {
  id: string;
  nome: string;
  descricao?: string;
  is_active: boolean;
}

// Tipo para criar ou atualizar um segmento
export interface SegmentFormValues {
  nome: string;
  descricao?: string;
  is_active: boolean;
}