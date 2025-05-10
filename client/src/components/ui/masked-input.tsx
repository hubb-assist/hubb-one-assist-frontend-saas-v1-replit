import React, { forwardRef } from 'react';
import InputMask from 'react-input-mask';
import { Input } from './input';
import { cn } from '@/lib/utils';

// Componente para input com máscara que mantém compatibilidade com react-hook-form
export const MaskedInput = forwardRef<
  HTMLInputElement,
  {
    mask: string;
    maskPlaceholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    value?: string;
    name?: string;
    className?: string;
    placeholder?: string;
    type?: string;
    alwaysShowMask?: boolean;
    beforeMaskedStateChange?: (state: any) => any;
    [key: string]: any;
  }
>(
  (
    {
      mask,
      maskPlaceholder = '_',
      onChange,
      onBlur,
      value,
      name,
      className,
      placeholder,
      type = 'text',
      alwaysShowMask = false,
      beforeMaskedStateChange,
      ...props
    },
    ref
  ) => {
    return (
      <InputMask
        mask={mask}
        maskPlaceholder={maskPlaceholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        alwaysShowMask={alwaysShowMask}
        beforeMaskedStateChange={beforeMaskedStateChange}
      >
        {(inputProps: any) => (
          <Input
            {...inputProps}
            {...props}
            type={type}
            name={name}
            placeholder={placeholder}
            className={cn(className)}
            ref={ref}
          />
        )}
      </InputMask>
    );
  }
);

MaskedInput.displayName = 'MaskedInput';

// Componente específico para CPF - 000.000.000-00
export const CPFInput = forwardRef<
  HTMLInputElement,
  Omit<React.ComponentProps<typeof MaskedInput>, 'mask'>
>((props, ref) => {
  return (
    <MaskedInput
      mask="999.999.999-99"
      placeholder="000.000.000-00"
      {...props}
      ref={ref}
    />
  );
});

CPFInput.displayName = 'CPFInput';

// Componente específico para CNPJ - 00.000.000/0001-00
export const CNPJInput = forwardRef<
  HTMLInputElement,
  Omit<React.ComponentProps<typeof MaskedInput>, 'mask'>
>((props, ref) => {
  return (
    <MaskedInput
      mask="99.999.999/9999-99"
      placeholder="00.000.000/0001-00"
      {...props}
      ref={ref}
    />
  );
});

CNPJInput.displayName = 'CNPJInput';

// Componente Inteligente que identifica se é CPF ou CNPJ
export const DocumentInput = forwardRef<
  HTMLInputElement,
  Omit<React.ComponentProps<typeof MaskedInput>, 'mask'> & {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
>((props, ref) => {
  const { value = '', onChange, ...rest } = props;
  
  // Remove todos os caracteres não numéricos para analisar
  const rawValue = value.replace(/\D/g, '');
  
  // Define a máscara com base no tamanho do valor
  // CPF: 11 dígitos, CNPJ: 14 dígitos
  const mask = rawValue.length > 11 ? '99.999.999/9999-99' : '999.999.999-99';
  const placeholder = rawValue.length > 11 ? '00.000.000/0001-00' : '000.000.000-00';
  
  return (
    <MaskedInput
      mask={mask}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...rest}
      ref={ref}
      beforeMaskedStateChange={(state) => {
        // Se o valor estiver vazio, não aplicar máscara
        if (!state.value) {
          return state;
        }
        
        // Se o usuário estiver digitando mais que 14 caracteres, limitar
        const unmaskedValue = state.value.replace(/\D/g, '');
        if (unmaskedValue.length > 14) {
          return {
            ...state,
            value: state.value.slice(0, state.value.length - 1)
          };
        }
        
        // Se o valor exceder 11 dígitos, usar a máscara de CNPJ
        if (unmaskedValue.length > 11) {
          return {
            ...state,
            mask: '99.999.999/9999-99'
          };
        }
        
        // Caso contrário, usar a máscara de CPF
        return {
          ...state,
          mask: '999.999.999-99'
        };
      }}
    />
  );
});

DocumentInput.displayName = 'DocumentInput';

// Componente para telefone no formato brasileiro (00) 00000-0000
export const PhoneInput = forwardRef<
  HTMLInputElement,
  Omit<React.ComponentProps<typeof MaskedInput>, 'mask'>
>((props, ref) => {
  return (
    <MaskedInput
      mask="(99) 99999-9999"
      placeholder="(00) 00000-0000"
      {...props}
      ref={ref}
    />
  );
});

PhoneInput.displayName = 'PhoneInput';

// Componente para CEP 00000-000
export const CEPInput = forwardRef<
  HTMLInputElement,
  Omit<React.ComponentProps<typeof MaskedInput>, 'mask'>
>((props, ref) => {
  return (
    <MaskedInput
      mask="99999-999"
      placeholder="00000-000"
      {...props}
      ref={ref}
    />
  );
});

CEPInput.displayName = 'CEPInput';