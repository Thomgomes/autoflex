import { Input } from "@/components/ui/input";
import { BaseModal } from "./BaseModal";

interface MaterialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; stockQuantity: number }) => void;
  isSubmitting: boolean;
  initialData?: { name: string; stockQuantity: number } | null;
}

export function MaterialModal({ open, onOpenChange, onSubmit, isSubmitting, initialData }: MaterialModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit({
      name: formData.get("name") as string,
      stockQuantity: Number(formData.get("stockQuantity")),
    });
  };

  return (
    <BaseModal 
      open={open} 
      onOpenChange={onOpenChange} 
      title={initialData ? "Editar Material" : "Novo Material"}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nome do Material</label>
          <Input name="name" defaultValue={initialData?.name} placeholder="Ex: Aço, Madeira..." required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Quantidade</label>
          <Input name="stockQuantity" type="number" defaultValue={initialData?.stockQuantity} required />
        </div>
      </div>
    </BaseModal>
  );
}