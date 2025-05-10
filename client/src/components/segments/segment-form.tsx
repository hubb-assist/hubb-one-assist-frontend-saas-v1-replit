import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { DialogFooter } from "@/components/ui/dialog";
import { Segment, SegmentFormValues } from "./types";

// Schema de validação para formulário
const formSchema = z.object({
  nome: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  descricao: z.string().optional(),
  is_active: z.boolean().default(true),
});

interface SegmentFormProps {
  segment?: Segment;
  onSubmit: (values: SegmentFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function SegmentForm({ 
  segment, 
  onSubmit, 
  onCancel, 
  isSubmitting 
}: SegmentFormProps) {
  // Configura o formulário com valores padrão (mapeando de inglês para português)
  const form = useForm<SegmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: segment?.name || "",  // Usar name da API
      descricao: segment?.description || "", // Usar description da API
      is_active: segment?.is_active ?? true,
    },
  });

  // Handler de submissão
  const handleSubmit = (data: SegmentFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Campo: Nome */}
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome *</FormLabel>
              <FormControl>
                <Input placeholder="Nome do segmento" {...field} />
              </FormControl>
              <FormDescription>
                Nome que identifica este segmento.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: Descrição */}
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descrição do segmento (opcional)"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Breve descrição que esclarece o propósito deste segmento.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: Ativo */}
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Ativo</FormLabel>
                <FormDescription>
                  Determina se este segmento está ativo no sistema.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Botões do formulário */}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : segment ? "Atualizar" : "Criar"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}