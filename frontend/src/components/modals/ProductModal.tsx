import type { FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { BaseModal } from "./BaseModal";
import type { Product } from "@/types";

interface ProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; price: number }) => void;
  isSubmitting: boolean;
  initialData?: Product | null;
}

export function ProductModal({ open, onOpenChange, onSubmit, isSubmitting, initialData }: ProductModalProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    onSubmit({
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
    });
  };

  return (
    <BaseModal 
      open={open} 
      onOpenChange={onOpenChange} 
      title={initialData ? "Editar Produto" : "Novo Produto"}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitText={initialData ? "Atualizar Produto" : "Cadastrar Produto e Adicionar Receita"}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nome do Produto</label>
          <Input 
            name="name" 
            defaultValue={initialData?.name} 
            placeholder="Ex: Cadeira de Escritório..." 
            disabled={isSubmitting}
            required 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Preço Unitário (R$)</label>
          <Input 
            name="price" 
            type="number" 
            step="0.01"
            defaultValue={initialData?.price} 
            placeholder="0.00"
            disabled={isSubmitting}
            required 
          />
        </div>
      </div>
    </BaseModal>
  );
}