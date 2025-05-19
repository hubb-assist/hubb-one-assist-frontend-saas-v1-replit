import { z } from "zod";

/**
 * Schema de validação para o formulário de pacientes
 * Utilizado com zodResolver para validação no react-hook-form
 */
export const patientSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  cpf: z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),
  rg: z.string().optional(),
  birth_date: z.string().nonempty("Data de nascimento é obrigatória"),
  phone: z
    .string()
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Telefone inválido")
    .optional(),
  cep: z
    .string()
    .regex(/^\d{5}-\d{3}$/, "CEP deve estar no formato 00000-000"),
  address: z.string().nonempty("Endereço é obrigatório"),
  number: z.string().nonempty("Número é obrigatório"),
  complement: z.string().optional(),
  district: z.string().nonempty("Bairro é obrigatório"),
  city: z.string().nonempty("Cidade é obrigatória"),
  state: z.string().length(2, "Estado deve ter 2 caracteres"),
});

export type PatientSchemaType = z.infer<typeof patientSchema>;