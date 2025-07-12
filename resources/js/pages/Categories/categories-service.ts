
import { router } from '@inertiajs/react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

export function onSubmit(values: z.infer<typeof formSchema>) {
        
        const transformedValues = {
            ...values,
            parent_id: values.parent_id === "null" ? null : values.parent_id,
        }
        
        router.post("/categories",transformedValues, {
            onSuccess: () => {
                console.log(transformedValues)
                form.reset();
            },
            onError: (errors) => {
                console.log("Validation errors", errors);
            }
        }) 
       
    }

export function handleDelete(id: number, onSuccess?: () => void, onError?: () => void) {
    router.delete(`categories/${id}`, {
        data: {confirm:true},
    onSuccess: () => {
        console.log("Succesfully deleted");
      onSuccess?.()
    },
    onError: (errors) => {
        console.error("Failed to delete", errors);
      onError?.()
    },
  })
}






export function handlePageChange(url:string | null) {
        if(url) {
            router.get(url);
        }
    }