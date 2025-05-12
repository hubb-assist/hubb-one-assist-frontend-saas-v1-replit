export interface Subscriber {
  id: string;
  name: string;
  email: string;
  document: string;
  plan_name?: string;
  segment_name?: string;
  is_active: boolean;
  created_at: string;
}

export interface Address {
  postal_code: string;
  street: string;
  number?: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  
  // Aliases para compatibilidade com a API do ViaCEP
  logradouro?: string;
  localidade?: string;
  uf?: string;
  zip_code?: string;
}

export interface SubscriberDetail extends Subscriber {
  phone?: string;
  address?: Address;
  admin_user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
  };
  subscription?: {
    id: string;
    plan_id: string;
    plan_name: string;
    segment_id: string;
    segment_name: string;
    status: string;
    start_date: string;
    end_date?: string;
    modules: Array<{
      id: string;
      name: string;
      is_active: boolean;
    }>;
  };
}