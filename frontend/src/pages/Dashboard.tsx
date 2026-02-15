import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductionSuggestion } from '@/store/slices/productionSlice';
import type { RootState, AppDispatch } from '@/store/index';
import Loading from '@/components/Loading';

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { suggestions, totalValue, loading, error } = useSelector((state: RootState) => state.production);

  useEffect(() => {
    dispatch(fetchProductionSuggestion());
  }, [dispatch]);

  if (loading) return <Loading/>;
  if (error) return <p className="p-10 text-red-500 font-bold">{error}</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-slate-900">Dashboard de Produção</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Valor Total Sugerido</p>
        <p className="text-4xl font-black text-indigo-600">
          {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="font-bold text-slate-700">O que produzir agora:</h2>
        </div>
        <div className="p-4">
          {suggestions.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {suggestions.map((s, idx) => (
                <li key={idx} className="py-3 flex justify-between items-center">
                  <span className="font-medium text-slate-700">{s.productName}</span>
                  <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold">
                    x {s.quantityToProduce}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400 italic py-4">
              Nenhuma sugestão disponível. Verifique se há produtos com receitas e materiais em estoque.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}