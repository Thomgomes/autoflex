/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "@/components/ui/input";
import { BaseModal } from "./BaseModal";

export function ProductModal({ open, onOpenChange, onSubmit, isSubmitting, initialData }: any) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
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
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nome do Produto</label>
          <Input name="name" defaultValue={initialData?.name} placeholder="Ex: Cadeira, Mesa..." required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Preço de Venda (R$)</label>
          <Input name="price" type="number" step="0.01" defaultValue={initialData?.price} required />
        </div>
      </div>
    </BaseModal>
  );
}