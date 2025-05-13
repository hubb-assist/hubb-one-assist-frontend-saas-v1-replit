// Types for patient management

export interface Patient {
  id: string;
  name: string;
  cpf: string;
  rg: string;
  birth_date: string;
  phone?: string;
  zip_code: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  subscriber_id: string; // Para multi-tenant
}

export interface PatientFormData {
  name: string;
  cpf: string;
  rg: string;
  birth_date: string;
  phone?: string;
  zip_code: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
}

export interface PaginationParams {
  skip?: number;
  limit?: number;
  name?: string;
  is_active?: boolean;
}

export interface PaginatedPatients {
  data: Patient[];
  total: number;
  page: number;
  pageSize: number;
}