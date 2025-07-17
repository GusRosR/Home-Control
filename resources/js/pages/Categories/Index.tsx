
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


 const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href:'/categories',
    },
]; 

export default function Index(){

    const {categories} = usePage<PageProps>().props; /* Variable to store Category page props */
    const [openCreate, setOpenCreate] = useState(false); /* Variables for opening and closing dialog pop up for adding categories */
    const [openDelete, setOpenDelete] = useState(false); /* Variables for opening and closing dialog pop up for deleting categories */
    const [openEdit, setOpenEdit] = useState(false); /* Variables for opening and closing dialog pop up for editing categories */
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null); //Variables to send the category to delete handler
    const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null); //Variables to send the category to delete handler
    
     const onDeleteConfirm = () => {
        if(!categoryToDelete) return;
        handleDelete(categoryToDelete.id, () => {
            setOpenDelete(false);
            setCategoryToDelete(null);
        });
    } 
    const columns = getColumns({
        onEdit: (category) =>{
            setCategoryToEdit(category);
            setOpenEdit(true);
        },
        onDelete(category) {
            setCategoryToDelete(category);
            setOpenDelete(true);
        },
    });
    /* console.log(usePage<PageProps>().props); */

    return (
        <AppLayout breadcrumbs={breadcrumbs}>

            <Head title="Categories" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">Categories</h1>
                    {/* <Button>
                        Add Category
                    </Button> */}

                    {/* Pop up that shows when the user clicks Add Category */}
                    <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                        <DialogTrigger asChild>
                            <Button>Add Category</Button>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogTitle>Add a new category!</DialogTitle>
                            <Create onSuccess={() => setOpenCreate(false)} />
                        </DialogContent>
                    </Dialog>

                    
                </div>

                <DataTable 
                    columns={columns} 
                    data={categories.data}
                    pagination= {{
                        from: categories.from,
                        to: categories.to,
                        total: categories.total,
                        links: categories.links,
                        onPageChange: handlePageChange
                    }}
                />

                {/* Dialog to show to wait for user confirmation for deletition */}
                <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                    <DialogContent>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            This will permannently delete the <strong>{categoryToDelete?.name}</strong> category and the products
                            associated with it.
                        </DialogDescription>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button variant="destructive" onClick={onDeleteConfirm}>Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Pop up that shows when the user clicks the edit icon on the table records */}
                    <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                        <DialogContent>
                            <DialogTitle>Edit Category</DialogTitle>
                            {categoryToEdit && (
                            <Edit
                                category={categoryToEdit}
                                onSuccess={() => {
                                setOpenEdit(false);
                                setCategoryToEdit(null);
                                }}
                            />
                            )} 
                        </DialogContent>
                    </Dialog>
            </div>
        </AppLayout>
    );
}