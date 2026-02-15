import type { FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { addMaterialToRecipe, removeMaterialFromRecipe } from "@/store/slices/productMaterialSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Plus, FlaskConical } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

interface RecipeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: number | null;
  productName: string;
}

export function RecipeModal({ open, onOpenChange, productId, productName }: RecipeModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { items: materials } = useSelector((state: RootState) => state.material);
  const { recipeItems, loading } = useSelector((state: RootState) => state.productMaterial);

  const handleAddMaterial = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!productId) return;

    const formData = new FormData(e.currentTarget);
    const materialId = Number(formData.get("materialId"));
    const quantityRequired = Number(formData.get("quantityRequired"));

    try {
      await dispatch(addMaterialToRecipe({ productId, materialId, quantityRequired })).unwrap();
      toast.success("Material adicionado à receita!");
      e.currentTarget.reset();
    } catch {
      toast.error("Erro ao vincular material.");
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await dispatch(removeMaterialFromRecipe(id)).unwrap();
      toast.success("Material removido da receita.");
    } catch {
      toast.error("Erro ao remover vínculo.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FlaskConical className="size-5 text-indigo-600" />
            Receita: {productName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <form onSubmit={handleAddMaterial} className="flex gap-2 items-end bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="flex-1 space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-500">Material</label>
              <select name="materialId" className="w-full text-sm p-2 border rounded-md bg-white" required>
                <option value="">Selecionar...</option>
                {materials.map(m => (
                  <option key={m.id} value={m.id}>{m.name} (Disp: {m.stockQuantity})</option>
                ))}
              </select>
            </div>
            <div className="w-24 space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-500">Qtd.</label>
              <Input name="quantityRequired" type="number" min="1" required className="bg-white" />
            </div>
            <Button type="submit" size="icon" className="bg-indigo-600">
              <Plus className="size-4" />
            </Button>
          </form>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Insumos Necessários</h4>
            <div className="max-h-50 overflow-auto border rounded-md divide-y divide-slate-100">
              {loading && recipeItems.length === 0 ? (
                <div className="p-4 flex justify-center"><Spinner className="size-4" /></div>
              ) : recipeItems.length > 0 ? (
                recipeItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="text-sm font-bold text-slate-700">{item.material.name}</p>
                      <p className="text-xs text-slate-400">Consome {item.quantityRequired} un por unidade produzida</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleRemove(item.id!)} className="text-red-400 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-xs text-slate-400 italic">Nenhum material associado a este produto.</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}