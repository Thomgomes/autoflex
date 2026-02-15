/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';
import { addProduct, updateProduct } from '@/store/slices/productSlice';
import { addMaterialToRecipe, removeMaterialFromRecipe, fetchRecipeByProduct } from '@/store/slices/productMaterialSlice';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BaseModal } from "./BaseModal";
import { Plus, Trash2, Calculator, FlaskConical, Save } from "lucide-react";
import { toast } from "sonner";
import api from '@/services/api';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

export function ProductModal({ open, onOpenChange, initialData }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { items: allMaterials } = useSelector((state: RootState) => state.material);
  const { recipeItems, loading: recipeLoading } = useSelector((state: RootState) => state.productMaterial);

  const [product, setProduct] = useState<any>(initialData || null);
  const [name, setName] = useState(initialData?.name || '');
  const [price, setPrice] = useState(initialData?.price || '');
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [simulation, setSimulation] = useState({ quantityToProduce: 0, subtotal: 0 });

  // Busca a receita se for edição
  useEffect(() => {
    if (product?.id) {
      dispatch(fetchRecipeByProduct(product.id));
    }
  }, [product, dispatch]);

  // Atualiza a simulação sempre que a receita mudar
  useEffect(() => {
    const updateSimulation = async () => {
      if (recipeItems.length > 0 && price) {
        const dto = recipeItems.map(item => ({
          materialId: item.materialId,
          quantityRequired: item.quantityRequired
        }));
        const response = await api.post('/production/simulate', { 
            price: Number(price), 
            requirements: dto 
        });
        setSimulation(response.data);
      } else {
        setSimulation({ quantityToProduce: 0, subtotal: 0 });
      }
    };
    updateSimulation();
  }, [recipeItems, price]);

  const handleSaveProduct = async () => {
    setIsSavingProduct(true);
    try {
      const data = { name, price: Number(price) };
      if (product?.id) {
        const updated = await dispatch(updateProduct({ ...product, ...data })).unwrap();
        setProduct(updated);
        toast.success("Informações do produto atualizadas.");
      } else {
        const created = await dispatch(addProduct(data)).unwrap();
        setProduct(created);
        toast.success("Produto criado! Agora você pode adicionar a composição.");
      }
    } catch {
      toast.error("Erro ao salvar produto.");
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleAddMaterial = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const materialId = Number(formData.get("materialId"));
    const quantityRequired = Number(formData.get("quantityRequired"));

    try {
      await dispatch(addMaterialToRecipe({ 
        productId: product.id, 
        materialId, 
        quantityRequired 
      })).unwrap();
      e.currentTarget.reset();
    } catch {
      toast.error("Erro ao adicionar insumo.");
    }
  };

  return (
    <BaseModal 
      open={open} 
      onOpenChange={onOpenChange} 
      title={product ? `Editar: ${product.name}` : "Novo Produto"} 
      isSubmitting={false}
      onSubmit={(e) => e.preventDefault()}
      submitText="" // Removido pois usamos botões internos
    >
      <div className="space-y-6">
        {/* PARTE 1: DADOS BÁSICOS */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-500">Nome do Produto</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Bolo..." />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-500">Preço (R$)</label>
            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" />
          </div>
          <Button 
            className="col-span-2 mt-2 bg-slate-900" 
            onClick={handleSaveProduct}
            disabled={!name || !price || isSavingProduct}
          >
            {isSavingProduct ? <Spinner className="size-4" /> : <><Save className="size-4 mr-2" /> {product ? "Atualizar Dados" : "Salvar e Definir Composição"}</>}
          </Button>
        </div>

        {/* PARTE 2: COMPOSIÇÃO (Estilo RecipeModal) */}
        <div className={cn("space-y-4", !product && "opacity-50 pointer-events-none")}>
          <div className="flex items-center gap-2">
            <FlaskConical className="size-4 text-indigo-600" />
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Composição da Receita</h4>
          </div>

          <form onSubmit={handleAddMaterial} className="flex gap-2 items-end">
            <div className="flex-1 space-y-1">
              <select name="materialId" className="w-full text-sm p-2 border rounded-md bg-white" required>
                <option value="">Insumo...</option>
                {allMaterials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <Input name="quantityRequired" type="number" placeholder="Qtd" className="w-20 h-9" required />
            <Button type="submit" size="icon" className="bg-indigo-600 h-9 w-9">
              <Plus className="size-4" />
            </Button>
          </form>

          <div className="max-h-[150px] overflow-auto border rounded-md divide-y bg-white">
            {recipeItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3">
                <p className="text-sm font-medium text-slate-700">{item.material?.name} <span className="text-slate-400 font-normal">({item.quantityRequired} un)</span></p>
                <Button variant="ghost" size="icon" onClick={() => dispatch(removeMaterialFromRecipe(item.id!))} className="text-red-400 h-8 w-8">
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* PAINEL DE VIABILIDADE */}
          <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 flex items-start gap-3">
            <Calculator className="size-4 text-indigo-600 mt-0.5" />
            <div className="text-[11px] leading-tight">
              <p className="font-bold text-indigo-700 uppercase">Viabilidade Técnica Individual</p>
              <p className="text-slate-600">
                Capacidade de <span className="font-bold">{simulation.quantityToProduce} unidades</span>. 
                Faturamento: <span className="font-bold text-indigo-900">{simulation.subtotal.toLocaleString('pt-BR', {style: 'currency', currency:'BRL'})}</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}