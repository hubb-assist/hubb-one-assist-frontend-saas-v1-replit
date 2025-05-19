export interface PatientFormData {
  name: string;
  cpf: string;
  rg?: string;
  birth_date: string;
  phone?: string;
  cep: string;
  address: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
}

export interface Patient extends PatientFormData {
  id: string;
  created_at: string;
  is_active: boolean;
}