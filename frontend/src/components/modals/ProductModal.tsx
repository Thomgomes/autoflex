/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';
import { addMaterialToRecipe } from '@/store/slices/productMaterialSlice';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BaseModal } from "./BaseModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Trash2, Calculator } from "lucide-react";
import api from '@/services/api';

export function ProductModal({ open, onOpenChange, onSubmit, isSubmitting, initialData }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { items: materials } = useSelector((state: RootState) => state.material);
  
  const [selectedMaterials, setSelectedMaterials] = useState<any[]>([]);
  const [productPrice, setProductPrice] = useState(initialData?.price || 0);
  const [simulation, setSimulation] = useState({ quantityToProduce: 0, subtotal: 0 });
  const [showConfirmEmpty, setShowConfirmEmpty] = useState(false);
  const [pendingData, setPendingData] = useState<any>(null);

  // Gatilho para o cálculo no Backend sempre que a composição mudar
  useEffect(() => {
    const fetchSimulation = async () => {
      if (selectedMaterials.length > 0) {
        const dto = selectedMaterials.map(m => ({ 
          materialId: m.materialId, 
          quantityRequired: m.quantityRequired 
        }));
        const response = await api.post('/production/simulate', dto);
        setSimulation(response.data);
      } else {
        setSimulation({ quantityToProduce: 0, subtotal: 0 });
      }
    };
    fetchSimulation();
  }, [selectedMaterials]);

  const handleFinalSubmit = async (data: any) => {
    // 1. Envia o Produto
    const product = await onSubmit(data); // Assume que o onSubmit retorna o produto criado
    
    // 2. Envia as associações sequencialmente se houver
    if (product && selectedMaterials.length > 0) {
      for (const mat of selectedMaterials) {
        await dispatch(addMaterialToRecipe({
          productId: product.id,
          materialId: mat.materialId,
          quantityRequired: mat.quantityRequired
        }));
      }
    }
    onOpenChange(false);
  };

  const handleAttemptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = {
      name: formData.get("name") as string,
      price: productPrice
    };

    if (selectedMaterials.length === 0) {
      setPendingData(data);
      setShowConfirmEmpty(true);
    } else {
      handleFinalSubmit(data);
    }
  };

  return (
    <>
      <BaseModal open={open} onOpenChange={onOpenChange} title="Configurar Produto" onSubmit={handleAttemptSubmit} isSubmitting={isSubmitting}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-500">Nome do Produto</label>
              <Input name="name" defaultValue={initialData?.name} required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-500">Preço Base (R$)</label>
              <Input type="number" step="0.01" value={productPrice} onChange={(e) => setProductPrice(Number(e.target.value))} required />
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase">Composição</h4>
              <Button type="button" variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => setSelectedMaterials([...selectedMaterials, { materialId: '', quantityRequired: 1 }])}>
                <Plus className="size-3 mr-1" /> Adicionar Insumo
              </Button>
            </div>
            
            <div className="space-y-2">
              {selectedMaterials.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <select 
                    className="flex-1 text-sm border rounded p-1 h-8"
                    value={item.materialId}
                    onChange={(e) => {
                      const newMats = [...selectedMaterials];
                      newMats[index].materialId = Number(e.target.value);
                      setSelectedMaterials(newMats);
                    }}
                  >
                    <option value="">Selecione...</option>
                    {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                  <Input 
                    type="number" 
                    className="w-16 h-8" 
                    value={item.quantityRequired} 
                    onChange={(e) => {
                      const newMats = [...selectedMaterials];
                      newMats[index].quantityRequired = Number(e.target.value);
                      setSelectedMaterials(newMats);
                    }}
                  />
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-red-400" onClick={() => setSelectedMaterials(selectedMaterials.filter((_, i) => i !== index))}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {selectedMaterials.length > 0 && (
            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 flex items-start gap-3">
              <Calculator className="size-4 text-indigo-600 mt-0.5" />
              <div className="text-[11px] leading-tight">
                <p className="font-bold text-indigo-700 uppercase">Viabilidade Técnica</p>
                <p className="text-slate-600">
                  Capacidade de <span className="font-bold">{simulation.quantityToProduce} unidades</span>. 
                  Faturamento total: <span className="font-bold text-indigo-900">{simulation.subtotal.toLocaleString('pt-BR', {style: 'currency', currency:'BRL'})}</span>.
                </p>
              </div>
            </div>
          )}
        </div>
      </BaseModal>

      {/* Alerta de Confirmação para Receita Vazia */}
      <AlertDialog open={showConfirmEmpty} onOpenChange={setShowConfirmEmpty}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Produto sem Composição?</AlertDialogTitle>
            <AlertDialogDescription>
              Você não associou nenhuma matéria-prima. Este produto não aparecerá nas sugestões de produção do Dashboard. Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar e Adicionar</AlertDialogCancel>
            <AlertDialogAction className="bg-indigo-600" onClick={() => handleFinalSubmit(pendingData)}>Confirmar Criação</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}