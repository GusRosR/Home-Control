import { router } from '@inertiajs/react';
import { toast } from 'sonner';

export function onSubmit(
    values: z.infer<typeof formSchema>,
    onSuccess?: () => void,
    onError?: () => void
    ) {
    const transformedValues = {
        ...values,
        parent_id: values.parent_id === 'null' ? null : values.parent_id,
    };
    router.post('/categories', transformedValues, {
        preserveScroll:true,
        preserveState:false,
        onSuccess: () => {
            onSuccess?.();
            /* toast('Category successfully created!'); */
        },
        onError: (errors) => {
            onError?.();
            console.error('Failed to submit', errors);
           
        },
    });
}

export function handleDelete(id: number, onSuccess?: () => void, onError?: () => void) {
    router.delete(`categories/${id}`, {
        data: { confirm: true },
        onSuccess: () => {
            /* toast('Category successfully deleted!'); */
            onSuccess?.();
        },
        onError: (errors) => {
            console.error('Failed to delete', errors);
            /* toast('Ooops! Something went wrong!', {
                description: `The record couldn not be deleted for the next reasons: ${errors}`,
            }); */
            onError?.();
        },
    });
}

export function handleEdit(
    id:number,
    values: z.infer<typeof formSchema>,
    onSuccess?: () => void,
    onError?: () => void
    ) {
    const transformedValues = {
        ...values,
        parent_id: values.parent_id === 'null' ? null : values.parent_id,
    };
    router.put(`categories/${id}`, transformedValues, {
        onSuccess: () => {
            onSuccess?.();
            /* toast('Category successfully updated!'); */
        },
        onError: (errors) => {
            onError?.();
            console.error('Failed to edit', errors);

        },
    });
}

export function handlePageChange(url: string | null) {
    if (url) {
        router.get(url);
    }
}
