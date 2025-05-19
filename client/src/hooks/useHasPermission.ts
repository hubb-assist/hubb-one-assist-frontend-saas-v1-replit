import { useAuth } from "@/lib/auth";

/**
 * Hook para verificar se o usuário atual possui uma determinada permissão
 * @param permission String com o nome da permissão a ser verificada
 * @returns Boolean indicando se o usuário possui a permissão
 */
export function useHasPermission(permission: string): boolean {
  const { user } = useAuth();
  
  // Verificar se o usuário possui a permissão específica
  if (user?.permissions?.includes(permission)) {
    return true;
  }
  
  // Verificações por role (fallback)
  if (permission === 'CAN_CREATE_PATIENT' || 
      permission === 'CAN_VIEW_PATIENT' || 
      permission === 'CAN_EDIT_PATIENT' || 
      permission === 'CAN_DELETE_PATIENT') {
    return user?.role === 'DONO_ASSINANTE' || user?.role === 'SUPER_ADMIN';
  }
  
  return false;
}