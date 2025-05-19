/**
 * Funções utilitárias para formatação de inputs com máscaras
 */

/**
 * Formata CPF: 000.000.000-00
 */
export function formatCpf(value: string): string {
  // Remove caracteres não numéricos
  const cleanValue = value.replace(/\D/g, '');
  
  // Aplica a máscara
  let formatted = cleanValue;
  if (cleanValue.length > 3) {
    formatted = cleanValue.replace(/^(\d{3})(\d)/, '$1.$2');
  }
  if (cleanValue.length > 6) {
    formatted = formatted.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
  }
  if (cleanValue.length > 9) {
    formatted = formatted.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
  }
  
  return formatted;
}

/**
 * Formata telefone: (00) 00000-0000
 */
export function formatPhone(value: string): string {
  // Remove caracteres não numéricos
  const cleanValue = value.replace(/\D/g, '');
  
  // Aplica a máscara
  let formatted = cleanValue;
  if (cleanValue.length > 2) {
    formatted = cleanValue.replace(/^(\d{2})(\d)/, '($1) $2');
  }
  if (cleanValue.length > 7) {
    formatted = formatted.replace(/^\((\d{2})\) (\d{5})(\d)/, '($1) $2-$3');
  }
  
  return formatted;
}

/**
 * Formata CEP: 00000-000
 */
export function formatCep(value: string): string {
  // Remove caracteres não numéricos
  const cleanValue = value.replace(/\D/g, '');
  
  // Aplica a máscara
  let formatted = cleanValue;
  if (cleanValue.length > 5) {
    formatted = cleanValue.replace(/^(\d{5})(\d)/, '$1-$2');
  }
  
  return formatted;
}

/**
 * Removes formatação (deixa somente números)
 */
export function cleanNumber(value: string): string {
  return value.replace(/\D/g, '');
}