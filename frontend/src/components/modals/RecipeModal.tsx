import { useState, useEffect, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import {
  addMaterialToRecipe,
  removeMaterialFromRecipe,
} from "@/store/slices/productMaterialSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Plus, FlaskConical, Calculator } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import api from "@/services/api";

interface RecipeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: number | null;
  productName: string;
  productPrice?: number;
}

export function RecipeModal({
  open,
  onOpenChange,
  productId,
  productName,
  productPrice,
}: RecipeModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { items: materials } = useSelector(
    (state: RootState) => state.material,
  );
  const { recipeItems, loading } = useSelector(
    (state: RootState) => state.productMaterial,
  );

  const [simulation, setSimulation] = useState({
    quantityToProduce: 0,
    subtotal: 0,
  });

  useEffect(() => {
    const updateSimulation = async () => {
      if (recipeItems.length > 0 && productPrice) {
        try {
          const dto = recipeItems.map((item) => ({
            productId: productId,
            materialId: item.material?.id || item.materialId,
            quantityRequired: item.quantityRequired,
          }));
          const response = await api.post("/production/simulate", {
            price: productPrice,
            requirements: dto,
          });
          setSimulation(response.data);
        } catch {
          setSimulation({ quantityToProduce: 0, subtotal: 0 });
        }
      } else {
        setSimulation({ quantityToProduce: 0, subtotal: 0 });
      }
    };
    updateSimulation();
  }, [recipeItems, productPrice, productId]);

  const handleAddMaterial = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!productId) return;

    const formData = new FormData(e.currentTarget);
    const materialId = Number(formData.get("materialId"));
    const quantityRequired = Number(formData.get("quantityRequired"));

    try {
      await dispatch(
        addMaterialToRecipe({ productId, materialId, quantityRequired }),
      ).unwrap();
      toast.success("Insumo adicionado!");
      e.currentTarget.reset();
    } catch {
      toast.error("Erro ao vincular insumo.");
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await dispatch(removeMaterialFromRecipe(id)).unwrap();
      toast.success("Removido da composição.");
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
            Composição: {productName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <form
            onSubmit={handleAddMaterial}
            className="flex gap-2 items-end bg-slate-50 p-3 rounded-lg border border-slate-200"
          >
            <div className="flex-1 space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-500">
                Material
              </label>
              <select
                data-testid="recipe-material-select"
                name="materialId"
                className="w-full text-sm p-2 border rounded-md bg-white h-9"
                required
              >
                <option value="">Selecionar...</option>
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} (Disp: {m.stockQuantity})
                  </option>
                ))}
              </select>
            </div>
            <div className="w-24 space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-500">
                Qtd.
              </label>
              <Input
              data-testid="recipe-quantity"
                name="quantityRequired"
                type="number"
                min="1"
                required
                className="bg-white h-9"
              />
            </div>
            <Button data-testid="recipe-add" type="submit" size="icon" className="bg-indigo-600 h-9 w-9">
              <Plus className="size-4" />
            </Button>
          </form>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
              Insumos Necessários
            </h4>
            <div className="max-h-50 overflow-auto border rounded-md divide-y divide-slate-100 bg-white shadow-sm">
              {loading && recipeItems.length === 0 ? (
                <div className="p-4 flex justify-center">
                  <Spinner className="size-4" />
                </div>
              ) : recipeItems.length > 0 ? (
                recipeItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="text-sm">
                      <p className="font-bold text-slate-700">
                        {item.material?.name || "Insumo"}
                      </p>
                      <p className="text-slate-400">
                        Gasto: {item.quantityRequired} un por produto
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(item.id!)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-xs text-slate-400 italic">
                  Nenhum insumo associado.
                </p>
              )}
            </div>
          </div>

          {recipeItems.length > 0 && (
            <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100 flex items-start gap-3">
              <Calculator className="size-4 text-emerald-600 mt-0.5" />
              <div className="text-[11px] leading-tight text-slate-600">
                <p className="font-bold text-emerald-700 uppercase tracking-tighter mb-1">
                  Análise de Viabilidade Técnica
                </p>
                <p>
                  Baseado no estoque, é possível produzir{" "}
                  <span className="font-bold text-slate-900">
                    {simulation.quantityToProduce} unidades
                  </span>{" "}
                  deste item.
                </p>
                <p className="mt-1">
                  Receita total estimada:{" "}
                  <span className="font-black text-emerald-600">
                    {simulation.subtotal.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                  .
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
