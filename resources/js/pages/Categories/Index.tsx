
"use client"

import { DataTable } from "@/components/ui/data-table";
import AppLayout from "@/layouts/app-layout";
import { Category, PageProps, type BreadcrumbItem } from "@/types";
import { Head, router, usePage } from "@inertiajs/react";
import { getColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Create from "./Create";
import { handleDelete, handlePageChange } from "./categories-service";
import Edit from "./Edit";
import { Input } from "@/components/ui/input";
import { useCategoriesController } from "@/hooks/use-category-controller";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";


 const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href:'/categories',
    },
]; 

export default function Index(){

    const {categories } = usePage<PageProps>().props; /* Variable to store Category page props */

     const {
    search,
    sort,
    handleSearch,
    handleSortChange,
    dialog,
    openCreateDialog,
    closeCreateDialog,
    openEditDialog,
    closeEditDialog,
    openDeleteDialog,
    closeDeleteDialog,
    confirmDelete
  } = useCategoriesController();

    const columns = getColumns({
        onEdit: openEditDialog,
        onDelete: openDeleteDialog,
    });
    /* console.log(usePage<PageProps>().props); */

    return (
        <AppLayout breadcrumbs={breadcrumbs}>

            <Head title="Categories" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">Categories</h1>
                   
                    {/* Pop up that shows when the user clicks Add Category */}
                    <Dialog open={dialog.create} onOpenChange={(open) => open ? openCreateDialog() : closeCreateDialog()}>
                        <DialogTrigger asChild>
                            <Button>Add Category</Button>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogTitle>Add a new category!</DialogTitle>
                            <Create onSuccess={closeCreateDialog} />
                        </DialogContent>
                    </Dialog>

                    
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <Input
                    type="text"
                    placeholder="Search categories..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="max-w-sm mb-4"
                  />
                  <RadioGroup 
                  defaultValue="newest" 
                  className=" ml-2.5 flex items-center gap-4"
                  onValueChange={handleSortChange}
                  >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="newest" id="newest" className="border-gray-500" />
                        <Label htmlFor="newest">Newest</Label>                  
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="oldest" id="oldest" className="border-gray-500" />
                        <Label htmlFor="oldest">Oldest</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="az" id="az" className="border-gray-500" />
                        <Label htmlFor="az">A-Z</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="za" id="za" className="border-gray-500" />
                        <Label htmlFor="za">Z-A</Label>
                    </div>
                  </RadioGroup>
                </div>
                

                <DataTable 
                  columns={columns} 
                  data={categories.data}
                  pagination={{
                    from: categories.from,
                    to: categories.to,
                    total: categories.total,
                    links: categories.links,
                    onPageChange: (url) => {
                        if(typeof url === 'string'){
                            router.get(url, { preserveState: true });
                        }
                    }
                  }}
                />

                {/* Dialog to show to wait for user confirmation for deletition */}
                <Dialog open={dialog.delete} onOpenChange={(open) => open ? openDeleteDialog(dialog.categoryToDelete!) : closeDeleteDialog()}>
                   <DialogContent>
                     <DialogTitle>Are you sure?</DialogTitle>
                     <DialogDescription>
                       This will permanently delete the <strong>{dialog.categoryToDelete?.name}</strong> category and the products
                       associated with it.
                     </DialogDescription>
                     <DialogFooter>
                       <DialogClose asChild>
                         <Button variant="outline">Cancel</Button>
                       </DialogClose>
                       <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
                     </DialogFooter>
                   </DialogContent>
                 </Dialog>

                {/* Pop up that shows when the user clicks the edit icon on the table records */}
                    <Dialog open={dialog.edit} onOpenChange={(open) => open ? openEditDialog(dialog.categoryToEdit!) : closeEditDialog()}>
                      <DialogContent>
                        <DialogTitle>Edit Category</DialogTitle>
                        {dialog.categoryToEdit && (
                          <Edit
                            category={dialog.categoryToEdit}
                            onSuccess={closeEditDialog}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
            </div>
        </AppLayout>
    );
}