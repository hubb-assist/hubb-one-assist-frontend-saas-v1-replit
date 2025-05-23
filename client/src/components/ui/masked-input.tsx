import React, { forwardRef, useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import { Input } from './input';
import { cn } from '@/lib/utils';

// Interface para o estado de máscara
interface MaskedState {
  value: string;
  selection: {
    start: number;
    end: number;
  };
  mask?: string;
}

// Componente para input com máscara que mantém compatibilidade com react-hook-form
// Tipo específico para as props do InputMask para evitar erros de type
interface InputMaskProps {
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
}

// Nosso componente MaskedInput com tipagem melhorada e correção para os problemas de renderização
export const MaskedInput = forwardRef<
  HTMLInputElement,
  InputMaskProps & { [key: string]: any }
>(
  (
    {
      mask,
      maskPlaceholder = '_',
      onChange,
      onBlur,
      value = '',
      name,
      className,
      placeholder,
      type = 'text',
      alwaysShowMask = false,
      beforeMaskedStateChange,
      ...otherProps
    },
    ref
  ) => {
    // Usar estado local para garantir que as mudanças de valor são refletidas na UI
    const [inputValue, setInputValue] = useState(value);
    
    // Atualizar o estado local quando o valor externo mudar
    useEffect(() => {
      setInputValue(value);
    }, [value]);
    
    // Manipulador de mudança personalizado para atualizar o estado local E chamar o onChange original
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      if (onChange) {
        onChange(e);
      }
    };
    
    return (
      <InputMask
        mask={mask}
        maskPlaceholder={maskPlaceholder}
        value={inputValue}
        onChange={handleChange}
        onBlur={onBlur}
        alwaysShowMask={alwaysShowMask}
        beforeMaskedStateChange={beforeMaskedStateChange}
        {...otherProps}
      >
        {(inputProps: any) => {
          // Removemos as props específicas do InputMask que causam problemas no DOM
          const {
            maskPlaceholder: _maskPlaceholder,
            beforeMaskedStateChange: _beforeMaskedStateChange,
            alwaysShowMask: _alwaysShowMask,
            ...safeInputProps
          } = inputProps;
          
          // Forçamos o valor atual no Input para garantir que ele seja exibido corretamente
          return (
            <Input
              {...safeInputProps}
              type={type}
              name={name}
              placeholder={placeholder}
              className={cn(className)}
              ref={ref}
              value={inputValue} // Força o valor controlado
            />
          );
        }}
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
  // Extraímos apenas as props necessárias e seguras para evitar propagação de props inválidas
  const {
    value,
    onChange,
    onBlur,
    name,
    className,
    placeholder = "000.000.000-00",
    type = "text",
    disabled,
    required,
    id,
    ...otherProps
  } = props;
  
  // Usamos o componente com estado interno para garantir renderização correta
  return (
    <MaskedInput
      mask="999.999.999-99"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      name={name}
      className={className}
      placeholder={placeholder}
      type={type}
      disabled={disabled}
      required={required}
      id={id}
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
  // Extraímos apenas as props necessárias e seguras para evitar propagação de props inválidas
  const {
    value,
    onChange,
    onBlur,
    name,
    className,
    placeholder = "00.000.000/0001-00",
    type = "text",
    disabled,
    required,
    id,
    ...otherProps
  } = props;
  
  return (
    <MaskedInput
      mask="99.999.999/9999-99"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      name={name}
      className={className}
      placeholder={placeholder}
      type={type}
      disabled={disabled}
      required={required}
      id={id}
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
  // Extraindo apenas as props necessárias para evitar warnings de props inválidas
  const {
    value = '',
    onChange,
    onBlur,
    name,
    className,
    placeholder: propPlaceholder,
    type = "text",
    disabled,
    required,
    id,
    ...otherProps
  } = props;
  
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
      onBlur={onBlur}
      name={name}
      className={className}
      type={type}
      disabled={disabled}
      required={required}
      id={id}
      ref={ref}
      beforeMaskedStateChange={(state: MaskedState) => {
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
  // Extraímos apenas as props necessárias e seguras para evitar propagação de props inválidas
  const {
    value,
    onChange,
    onBlur,
    name,
    className,
    placeholder = "(00) 00000-0000",
    type = "text",
    disabled,
    required,
    id,
    ...otherProps
  } = props;
  
  return (
    <MaskedInput
      mask="(99) 99999-9999"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      name={name}
      className={className}
      placeholder={placeholder}
      type={type}
      disabled={disabled}
      required={required}
      id={id}
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
  // Estado interno para capturar e exibir o valor atual
  const [localValue, setLocalValue] = useState(props.value || '');
  
  // Extraímos apenas as props necessárias e seguras para evitar propagação de props inválidas
  const {
    value,
    onChange,
    onBlur,
    name,
    className,
    placeholder = "00000-000",
    type = "text",
    disabled,
    required,
    id,
    ...otherProps
  } = props;
  
  // Atualiza o estado local quando a prop value mudar
  useEffect(() => {
    if (value !== undefined) {
      setLocalValue(value);
    }
  }, [value]);
  
  // Handler personalizado que atualiza o estado local e chama o onChange original
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };
  
  return (
    <MaskedInput
      mask="99999-999"
      value={localValue}
      onChange={handleChange}
      onBlur={onBlur}
      name={name}
      className={className}
      placeholder={placeholder}
      type={type}
      disabled={disabled}
      required={required}
      id={id}
      ref={ref}
    />
  );
});

CEPInput.displayName = 'CEPInput';