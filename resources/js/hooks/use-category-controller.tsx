
/* Hook created to handle all visual an state logic for our index file for categories to keep it simple */

import { handleDelete } from "@/pages/Categories/categories-service";
import { Category, PageProps } from "@/types";
import { router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useCategoriesController(){
    const { filters, flash } = usePage<PageProps>().props ?? {};
    const [search, setSearch] = useState(filters?.search || '');
    const [sort, setSort] = useState(filters?.sort || 'newest'); 

    type DialogState = {
        create: boolean;
        edit: boolean;
        delete: boolean;
        categoryToEdit: Category | null;
        categoryToDelete: Category | null;
    };

    const [dialog, setDialog] = useState<DialogState>({
        create: false,
        edit: false,
        delete: false,
        categoryToEdit: null,
        categoryToDelete: null,
    });

    useEffect(() => {
      if (!flash) return;
    
      if (flash.success) {
        toast.success(flash.success);
      }
    
      if (flash.error) {
        toast.error(flash.error);
      }
    }, [flash?.success, flash?.error]);


    function handleSearch(value:string) {
        setSearch(value);
        router.get(route('categories.index'), { search: value }, {
            preserveState: true,
            replace: true,
        });
    }

    function handleSortChange(value: string) {
      setSort(value);
      router.get(
        route('categories.index'),
        { search, sort: value }, // Include current search too!
        {
          preserveState: true,
          replace: true,
        }
      );
    } 

    function confirmDelete() {
        if (!dialog.categoryToDelete) return;

        handleDelete(dialog.categoryToDelete.id, () => {
            closeDeleteDialog();
        });
    }

    function openCreateDialog() {
    setDialog(prev => ({ ...prev, create: true }));
  }

  function closeCreateDialog() {
    setDialog(prev => ({ ...prev, create: false }));
  }

  function openEditDialog(category: Category) {
    setDialog(prev => ({ ...prev, edit: true, categoryToEdit: category }));
  }

  function closeEditDialog() {
    setDialog(prev => ({ ...prev, edit: false, categoryToEdit: null }));
  }

  function openDeleteDialog(category: Category) {
    setDialog(prev => ({ ...prev, delete: true, categoryToDelete: category }));
  }

  function closeDeleteDialog() {
    setDialog(prev => ({ ...prev, delete: false, categoryToDelete: null }));
  }

  return {
    search,
    sort, 
    setSearch,
    dialog,
    setDialog,
    handleSearch,
    handleSortChange, 
    openCreateDialog,
    closeCreateDialog,
    openEditDialog,
    closeEditDialog,
    openDeleteDialog,
    closeDeleteDialog,
    confirmDelete,
  };
}