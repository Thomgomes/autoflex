import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMaterials,
  addMaterial,
  deleteMaterial,
  updateMaterial,
} from "@/store/slices/materialSlice";
import type { RootState, AppDispatch } from "@/store";
import type { Material } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  PlusCircle,
  PackageSearch,
  Settings,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import Loading from "@/components/Loading";
import { MaterialModal } from "@/components/modals/MaterialModal";

export default function Materials() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.material);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<Material | null>(null);

  useEffect(() => {
    dispatch(fetchMaterials());
  }, [dispatch]);

  const handleCreateOpen = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEditOpen = (item: Material) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleModalSubmit = async (data: {
    name: string;
    stockQuantity: number;
  }) => {
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await dispatch(updateMaterial({ ...editingItem, ...data })).unwrap();
        toast.success(`Material "${data.name}" atualizado com sucesso!`);
      } else {
        await dispatch(addMaterial(data)).unwrap();
        toast.success(`Material "${data.name}" cadastrado com sucesso!`);
      }
      setModalOpen(false);
    } catch {
      toast.error("Ocorreu um erro ao processar a solicitação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await dispatch(deleteMaterial(deleteId)).unwrap();
        toast.success("Material removido permanentemente.");
      } catch {
        toast.error("Erro ao remover o material.");
      } finally {
        setDeleteId(null);
      }
    }
  };

  if (loading && items.length === 0)
    return <Loading message="Sincronizando materiais..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Matérias-primas
          </h1>
          <p className="text-slate-500">Gestão técnica de insumos</p>
        </div>
        <Button
          onClick={handleCreateOpen}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Novo Material
        </Button>
      </div>

      <MaterialModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleModalSubmit}
        isSubmitting={isSubmitting}
        initialData={editingItem}
      />

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(isOpen) => !isOpen && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Excluir material permanentemente?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação removerá o material do banco de dados e pode afetar
              produtos que dependem dele.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-lg flex items-center gap-2">
            <PackageSearch className="h-5 w-5 text-indigo-500" />
            Materiais no Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/30">
                <TableHead className="pl-6 w-20">ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead className="text-center">Estoque</TableHead>
                <TableHead className="text-right pr-8 sm:pr-12.5 w-20">
                  <Settings className="h-4 w-4 ml-auto text-slate-400" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="pl-6 font-mono text-xs text-slate-400">
                    #{item.id}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-700">
                    <span title={item.name}>
                      <span className="sm:hidden">
                        {item.name.length > 7
                          ? `${item.name.slice(0, 7)}...`
                          : item.name}
                      </span>

                      <span className="hidden sm:inline lg:hidden">
                        {item.name.length > 35
                          ? `${item.name.slice(0, 35)}...`
                          : item.name}
                      </span>

                      <span className="hidden lg:inline">{item.name}</span>
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        item.stockQuantity <= 5
                          ? "bg-red-100 text-red-600"
                          : "bg-emerald-100 text-emerald-600"
                      }`}
                    >
                      {item.stockQuantity} un
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="sm:hidden">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditOpen(item)}
                            className="cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteId(item.id)}
                            className="text-red-600 cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Deletar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="hidden sm:block">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                          onClick={() => handleEditOpen(item)}
                          title="Editar Material"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => setDeleteId(item.id)}
                          title="Excluir Material"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div></div>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-10 text-slate-400 italic"
                  >
                    Nenhum material cadastrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
