import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatar valores monetários para Reais (R$)
export function formatCurrency(value: number): string {
  // Garantir que o valor seja um número válido
  const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeValue);
}
