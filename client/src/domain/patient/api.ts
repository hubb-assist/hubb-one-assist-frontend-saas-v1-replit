import axios from "axios";
import { Patient, PatientFormData } from "./types";
import { API_CONFIG } from "@/lib/config";

const { BASE_URL } = API_CONFIG;

// Cliente HTTP para endpoints protegidos
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Para endpoints protegidos, incluímos credentials
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: API_CONFIG.TIMEOUT,
});

// Interceptador para debug
api.interceptors.request.use(config => {
  console.log('Fazendo requisição para API:', config.baseURL + config.url);
  return config;
});

// Interceptador para tratamento de erros
api.interceptors.response.use(
  response => response,
  error => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

export async function createPatient(data: PatientFormData): Promise<Patient> {
  const response = await api.post("/patients", data);
  return response.data;
}

export async function getPatients(params?: { skip?: number; limit?: number }): Promise<Patient[]> {
  const response = await api.get("/patients", { params });
  return response.data.items || [];
}

export async function getPatient(id: string): Promise<Patient> {
  const response = await api.get(`/patients/${id}`);
  return response.data;
}

export async function updatePatient(id: string, data: PatientFormData): Promise<Patient> {
  const response = await api.put(`/patients/${id}`, data);
  return response.data;
}

export async function deletePatient(id: string): Promise<void> {
  await api.delete(`/patients/${id}`);
}

export async function activatePatient(id: string): Promise<Patient> {
  const response = await api.patch(`/patients/${id}/activate`, {});
  return response.data;
}

export async function deactivatePatient(id: string): Promise<Patient> {
  const response = await api.patch(`/patients/${id}/deactivate`, {});
  return response.data;
}