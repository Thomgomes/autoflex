import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMaterials, addMaterial } from '@/store/slices/materialSlice';
import type { RootState, AppDispatch } from '@/store';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { PlusCircle, PackageSearch } from 'lucide-react';
import Loading from '@/components/Loading';

export default function Materials() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.material);
  
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');

  useEffect(() => {
    dispatch(fetchMaterials());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !stockQuantity) return;

    await dispatch(addMaterial({ name, stockQuantity: Number(stockQuantity) }));
    setName('');
    setStockQuantity('');
    setOpen(false);
  };

  if (loading && items.length === 0) return <Loading message="Sincronizando materiais..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Materiais</h1>
          <p className="text-slate-500">Gestão de matérias-primas para produção.</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <PlusCircle className="mr-2 h-4 w-4" /> Novo Material
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Matéria-Prima</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Aço, Madeira..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantidade em Estoque</label>
                <Input type="number" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} placeholder="0" />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full bg-indigo-600">Confirmar Cadastro</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-lg flex items-center gap-2">
            <PackageSearch className="h-5 w-5 text-indigo-500" />
            Lista de Materiais
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead className="text-right pr-6">Quantidade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="pl-6 font-mono text-xs text-slate-400">#{item.id}</TableCell>
                  <TableCell className="font-medium text-slate-700">{item.name}</TableCell>
                  <TableCell className="text-right pr-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.stockQuantity <= 5 ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>
                      {item.stockQuantity} un
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}