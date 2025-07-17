"use client"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Category, PageProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePage } from "@inertiajs/react";

import { useForm } from "react-hook-form";
import  {z, optional } from "zod";
import { handleEdit, onSubmit } from "./categories-service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


/* We create an interface to receive the editing props (or filling the forms with the stored info on the DB) */
interface EditProps {
    category: Category;
    onSuccess?: () => void;
}

/* Zod validation shown in the documentation */
const formSchema = z.object({
    name: z.string().min(1, "The name is required").trim(),
    parent_id: optional(z.string()),
})

export default function Edit({category, onSuccess}: EditProps) {

    /* Variable to store the props */
    const {categories} = usePage<PageProps>().props; 
    
    /* Dfocumentation code to define the form type to help autocomplete and mark type errors */
    const form = useForm<z.infer<typeof formSchema>> ({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: category.name,
            parent_id: category.parent_id ? String(category.parent_id) : "null",
        },
    })
    
    return(
       
        <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => handleEdit(category.id, values, onSuccess))} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem> {/* One Item of the form (Label and Input) */}
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Name of Category" {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="parent_id"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Parent Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                   <SelectTrigger>
                                     <SelectValue placeholder="Select the parent category" />
                                   </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    {/* We retrieve the database values to fill de select component */}
                                   <SelectItem value="null">None</SelectItem>
                                    {categories.data
                                          .map((cat: Category) => (
                                            <SelectItem key={cat.id} value={String(cat.id)}>
                                              {cat.name}
                                            </SelectItem>
                                        ))}
                                 </SelectContent>
                                 <FormDescription>
                                    Select the main category this sub-category will belong to.
                                 </FormDescription>
                            </Select>
                        </FormItem>
                    )}
                
                />
                <Button type="submit">Update</Button>
            </form>
        </Form>
       

    )
    
}