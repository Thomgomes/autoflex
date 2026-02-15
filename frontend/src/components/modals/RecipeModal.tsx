/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "@/components/ui/input";
import { BaseModal } from "./BaseModal";

export function RecipeModal({ open, onOpenChange, onSubmit, isSubmitting, materials }: any) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit({
      materialId: Number(formData.get("materialId")),
      quantityRequired: Number(formData.get("quantityRequired")),
    });
  };

  return (
    <BaseModal 
      open={open} 
      onOpenChange={onOpenChange} 
      title="Vincular Material ao Produto"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitText="Adicionar à Receita"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Material</label>
          <select name="materialId" className="w-full p-2 border rounded-md">
            {materials.map((m: any) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Quantidade Necessária</label>
          <Input name="quantityRequired" type="number" required />
        </div>
      </div>
    </BaseModal>
  );
}