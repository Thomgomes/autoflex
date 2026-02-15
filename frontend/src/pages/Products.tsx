import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  addProduct,
  deleteProduct,
  updateProduct,
} from "@/store/slices/productSlice";
import type { RootState, AppDispatch } from "@/store";
import type { Product } from "@/types";
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
  ShoppingBag,
  Settings,
  Pencil,
  Trash2,
  ReceiptText,
} from "lucide-react";
import Loading from "@/components/Loading";
import { ProductModal } from "@/components/modals/ProductModal";

import {
  fetchRecipeByProduct,
  clearRecipe,
} from "@/store/slices/productMaterialSlice";
import { fetchMaterials } from "@/store/slices/materialSlice";
import { RecipeModal } from "@/components/modals/RecipeModal";

export default function Products() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.product);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<Product | null>(null);

  const [recipeModalOpen, setRecipeModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchMaterials());
  }, [dispatch]);

  const handleCreateOpen = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEditOpen = (item: Product) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleModalSubmit = async (data: { name: string; price: number }) => {
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await dispatch(updateProduct({ ...editingItem, ...data })).unwrap();
        toast.success(`Produto "${data.name}" atualizado.`);
      } else {
        await dispatch(addProduct(data)).unwrap();
        toast.success(`Produto "${data.name}" cadastrado.`);
      }
      setModalOpen(false);
    } catch {
      toast.error("Erro ao processar produto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await dispatch(deleteProduct(deleteId)).unwrap();
        toast.success("Produto removido.");
      } catch {
        toast.error("Erro ao remover produto.");
      } finally {
        setDeleteId(null);
      }
    }
  };

  const handleManageRecipe = (product: Product) => {
    setSelectedProduct(product);
    dispatch(clearRecipe());
    dispatch(fetchRecipeByProduct(product.id!));
    setRecipeModalOpen(true);
  };

  if (loading && items.length === 0)
    return <Loading message="Carregando catálogo..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Produtos
          </h1>
          <p className="text-slate-500">Catálogo de produtos e precificação.</p>
        </div>
        <Button
          onClick={handleCreateOpen}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Novo Produto
        </Button>
      </div>

      <ProductModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleModalSubmit}
        isSubmitting={isSubmitting}
        initialData={editingItem}
      />

      <RecipeModal
        open={recipeModalOpen}
        onOpenChange={setRecipeModalOpen}
        productId={selectedProduct?.id || null}
        productName={selectedProduct?.name || ""}
      />

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(isOpen) => !isOpen && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Excluir produto permanentemente?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação removerá o produto e suas associações de receita.
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
            <ShoppingBag className="h-5 w-5 text-indigo-500" />
            Catálogo de Vendas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/30">
                <TableHead className="pl-6 w-20">ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead className="text-center">Preço</TableHead>
                <TableHead className="text-right pr-17 w-20">
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
                    {item.name}
                  </TableCell>
                  <TableCell className="text-center font-bold text-emerald-600">
                    {item.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50"
                        onClick={() => handleManageRecipe(item)}
                        title="Gerenciar Receita"
                      >
                        <ReceiptText className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                        onClick={() => handleEditOpen(item)}
                        title="Editar Produto"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => setDeleteId(item.id)}
                        title="Excluir Produto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
