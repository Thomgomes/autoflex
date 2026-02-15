import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductionSuggestion } from '@/store/slices/productionSlice';
import { fetchMaterials } from '@/store/slices/materialSlice';
import { fetchProducts } from '@/store/slices/productSlice';
import type { RootState, AppDispatch } from '@/store';
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  ArrowRight,
  ClipboardList
} from "lucide-react";
import { BentoGrid } from "@/components/ui/bento-grid";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Loading from '@/components/Loading';
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  
  const { suggestions, totalValue, loading: productionLoading } = useSelector((state: RootState) => state.production);
  const { items: materials, loading: materialsLoading } = useSelector((state: RootState) => state.material);
  const { items: products } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    dispatch(fetchProductionSuggestion());
    dispatch(fetchMaterials());
    dispatch(fetchProducts());
  }, [dispatch]);

  const criticalMaterials = materials.filter(m => m.stockQuantity <= 5);

  if (productionLoading || materialsLoading) {
    return <Loading message="Calculando sugestões e analisando estoque..." />;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 font-medium italic">Visão geral da capacidade produtiva e otimização de ativos.</p>
      </header>

      <BentoGrid className="grid grid-cols-1 md:grid-cols-4 grid-rows-none md:grid-rows-4 gap-4 auto-rows-[120px]">
        
        <Card className="md:col-span-2 md:row-span-1 bg-indigo-600 border-none p-6 flex flex-col justify-between group overflow-hidden relative">
          <TrendingUp className="absolute -right-4 -top-4 size-24 text-white/10 group-hover:scale-110 transition-transform" />
          <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest">Valor Estimado de Produção</p>
          <h2 className="text-4xl font-black text-white">
            {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </h2>
        </Card>

        <Card className="md:col-span-1 md:row-span-1 bg-white p-6 flex flex-col justify-between border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-tighter">Matérias-Primas</p>
            <Package className="size-4 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">{materials.length} <span className="text-sm font-normal text-slate-400">cadastradas</span></h3>
        </Card>

        <Card className="md:col-span-1 md:row-span-1 bg-white p-6 flex flex-col justify-between border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-tighter">Produtos Ativos</p>
            <ShoppingCart className="size-4 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">{products.length} <span className="text-sm font-normal text-slate-400">no catálogo</span></h3>
        </Card>

        <Card className="md:col-span-3 md:row-span-3 bg-white border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ClipboardList className="size-4 text-indigo-600" />
              <h3 className="font-bold text-slate-700 text-sm">Prioridade de Fabricação</h3>
            </div>
            <Badge variant="outline" className="text-[10px] uppercase font-bold text-indigo-600 border-indigo-200 bg-indigo-50">Ordenado por Valor</Badge>
          </div>
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-12 text-center text-[10px] uppercase">Pos</TableHead>
                  <TableHead className="text-[10px] uppercase">Produto</TableHead>
                  <TableHead className="text-center text-[10px] uppercase">Qtd. Sugerida</TableHead>
                  <TableHead className="text-right pr-6 text-[10px] uppercase">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suggestions.map((item, index) => (
                  <TableRow key={index} className={cn("group transition-colors", item.quantityToProduce === 0 && "opacity-40")}>
                    <TableCell className="text-center">
                      <span className="text-xs font-mono text-slate-400">0{index + 1}</span>
                    </TableCell>
                    <TableCell className="font-bold text-slate-700 text-sm">{item.productName}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="font-mono">{item.quantityToProduce} UN</Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6 font-black text-emerald-600 text-sm">
                      {item.subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Card className="md:col-span-1 md:row-span-3 bg-white border-slate-200 shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <AlertTriangle className="size-4 text-red-500" />
            <h3 className="font-bold text-slate-700 text-sm">Alertas de Insumos</h3>
          </div>
          <div className="flex-1 p-4 space-y-4 overflow-auto">
            {criticalMaterials.length > 0 ? (
              criticalMaterials.map(m => (
                <div key={m.id} className="p-3 rounded-lg border border-red-100 bg-red-50/30 space-y-1">
                  <p className="text-xs font-bold text-slate-700 truncate">{m.name}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-red-600 font-black uppercase">Estoque Crítico</span>
                    <span className="text-xs font-mono font-bold text-red-700">{m.stockQuantity} un</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-40">
                <Package className="size-8" />
                <p className="text-[10px] font-bold uppercase tracking-widest">Estoque Estável</p>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-slate-100">
            <button className="w-full flex items-center justify-between text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 transition-colors">
              Ver Inventário Completo
              <ArrowRight className="size-3" />
            </button>
          </div>
        </Card>

      </BentoGrid>
    </div>
  );
}