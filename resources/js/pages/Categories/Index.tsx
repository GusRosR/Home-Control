
import { DataTable } from "@/components/ui/data-table";
import AppLayout from "@/layouts/app-layout";
import { PageProps, type BreadcrumbItem } from "@/types";
import { Head, router, usePage } from "@inertiajs/react";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Create from "./Create";


 const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href:'/categories',
    },
]; 

export default function Index(){

    const {categories} = usePage<PageProps>().props;
    const [open, setOpen] = useState(false);


    return (
        <AppLayout breadcrumbs={breadcrumbs}>

            <Head title="Categories" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">Categories</h1>
                    {/* <Button>
                        Add Category
                    </Button> */}

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button>Add Category</Button>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogTitle>Add a new category!</DialogTitle>
                            <Create onSuccess={() => setOpen(false)} />
                        </DialogContent>
                    </Dialog>
                </div>

                <DataTable columns={columns} data={categories.data} />
            </div>
        </AppLayout>
    );
}